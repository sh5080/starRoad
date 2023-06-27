import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';
import { RowDataPacket, FieldPacket, ResultSetHeader } from 'mysql2';
import { AppError, CommonError } from '../types/AppError';
import { rowToCamelCase } from '../util/rowToCamelCase';

/**
 * 여행 일정 생성
 */
export const createTravelPlan = async (travelPlan: TravelPlan) => {
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      'INSERT INTO travel_plan (username, start_date, end_date, destination) VALUES (?, ?, ?, ?)',
      [travelPlan.username, travelPlan.startDate, travelPlan.endDate, travelPlan.destination]
    );
    const planId = result.insertId;
    return planId;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '일정 생성에 실패했습니다.', 500);
  }
};

/**
 * 여행 장소 생성
 */
export const createTravelLocationByPlanId = async (travelLocation: TravelLocation, planId: number): Promise<void> => {
  try {
    await db.execute(
      'INSERT INTO travel_location (plan_id, date, location, `order`, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
      [
        planId,
        travelLocation.date,
        travelLocation.location,
        travelLocation.order,
        travelLocation.latitude,
        travelLocation.longitude,
      ]
    );
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '날짜 및 장소 생성에 실패했습니다.', 500);
  }
};

/**
 * 사용자별 모든 여행 일정 조회
 */
export const getTravelPlansByUsername = async (username: string): Promise<TravelPlan[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM travel_plan WHERE username = ?', [
      username,
    ]);
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 일정 조회에 실패했습니다.', 500);
  }
};

/**
 * 특정 여행 일정의 모든 장소 조회
 */
export const getTravelLocationsByPlanId = async (planId: number): Promise<TravelLocation[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      'SELECT * FROM travel_location WHERE plan_id = ? ORDER BY date ASC, `order` ASC',
      [planId]
    );
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '날짜별 장소 조회에 실패했습니다.', 500);
  }
};

/**
 * 특정 여행 일정 조회
 */
export const getTravelPlanDetailsByPlanId = async (planId: string): Promise<TravelPlan> => {
  try {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM travel_plan WHERE plan_id = ?', [planId]);
    return rowToCamelCase(rows[0]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 일정 상세 조회에 실패했습니다.', 500);
  }
};

/**
 * 여행 장소 수정
 */
export const updateTravelLocation = async (
  username: string,
  travelLocation: TravelLocation
): Promise<TravelLocation> => {
  let conn;
  try {
    conn = await db.getConnection();

    await conn.beginTransaction();

    await conn.execute(
      'UPDATE travel_location SET location = ?, date = ?, `order` = ?, latitude = ?, longitude = ? WHERE plan_id = ? AND location_id = ?',
      [
        travelLocation.location,
        travelLocation.newDate,
        travelLocation.order,
        travelLocation.latitude,
        travelLocation.longitude,
        travelLocation.planId,
        travelLocation.locationId,
      ]
    );

    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute(
      'SELECT * FROM travel_location WHERE location_id = ?',
      [travelLocation.locationId]
    );

    let updatedLocation: TravelLocation = {
      locationId: rows[0].location_id,
      planId: rows[0].plan_id,
      location: rows[0].location,
      newDate: rows[0].date,
      order: rows[0].order,
      latitude: rows[0].latitude,
      longitude: rows[0].longitude,
    };

    await conn.commit();

    return updatedLocation;
  } catch (error) {
    if (conn) await conn.rollback();

    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '날짜별 장소 수정에 실패했습니다.', 500);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 여행 일정 삭제
 */
export const deleteTravelPlan = async (
  username: string,
  planId: number
): Promise<{ deletedPlan: TravelPlan[]; deletedLocations: TravelLocation[] }> => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [planData]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM travel_plan WHERE username = ? AND plan_id = ?',
      [username, planId]
    );

    const [locationData]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM travel_location WHERE plan_id = ?',
      [planId]
    );

    await connection.execute('DELETE FROM travel_location WHERE plan_id = ?', [planId]);
    await connection.execute('DELETE FROM travel_plan WHERE username = ? AND plan_id = ?', [username, planId]);

    await connection.commit();

    return {
      deletedPlan: planData.map(rowToCamelCase),
      deletedLocations: locationData.map(rowToCamelCase),
    };
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 일정 삭제에 실패했습니다.', 500);
  } finally {
    connection.release();
  }
};
