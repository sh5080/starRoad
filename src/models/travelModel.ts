import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { AppError, CommonError } from '../types/AppError';
import { rowToCamelCase } from '../util/rowToCamelCase';

/**
 * 여행 일정 생성
 */
export const createTravelPlan = async (travelPlan: TravelPlan) => {
  try {
    const [rows] = await db.execute(
      'INSERT INTO travel_plan (username, start_date, end_date, destination) VALUES (?, ?, ?, ?)',
      [travelPlan.username, travelPlan.startDate, travelPlan.endDate, travelPlan.destination]
    );
    const insertId = (rows as any).insertId;
    return insertId;
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
    const [rows] = await db.execute('SELECT * FROM travel_plan WHERE username = ?', [username]);
    return (rows as RowDataPacket[]).map(rowToCamelCase) as TravelPlan[];
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
    const [rows] = await db.execute('SELECT * FROM travel_location WHERE plan_id = ? ORDER BY date ASC, `order` ASC', [
      planId,
    ]);
    return (rows as RowDataPacket[]).map(rowToCamelCase) as TravelLocation[];
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
    return rowToCamelCase(rows[0]) as TravelPlan;
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
  try {
    await db.execute(
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

    const [rawLocation] = (await db.execute('SELECT * FROM travel_location WHERE location_id = ?', [
      travelLocation.locationId,
    ])) as [RowDataPacket[], FieldPacket[]];

    // Convert rawLocation (a RowDataPacket) to TravelLocation type
    let updatedLocation: TravelLocation = {
      locationId: rawLocation[0].locationId,
      planId: rawLocation[0].planId,
      location: rawLocation[0].location,
      newDate: rawLocation[0].date,
      order: rawLocation[0].order,
      latitude: rawLocation[0].latitude,
      longitude: rawLocation[0].longitude,
    };

    return updatedLocation;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '날짜별 장소 수정에 실패했습니다.', 500);
  }
};

/**
 * 여행 일정 삭제
 */
export const deleteTravelPlan = async (
  username: string,
  planId: number
): Promise<{ deletedPlan: TravelPlan[]; deletedLocations: TravelLocation[] }> => {
  try {
    const [planData] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM travel_plan WHERE username = ? AND plan_id = ?',
      [username, planId]
    );

    const [locationData] = await db.execute<RowDataPacket[]>('SELECT * FROM travel_location WHERE plan_id = ?', [
      planId,
    ]);

    await db.execute('DELETE FROM travel_location WHERE plan_id = ?', [planId]);
    await db.execute('DELETE FROM travel_plan WHERE username = ? AND plan_id = ?', [username, planId]);

    return {
      deletedPlan: planData.map(rowToCamelCase) as TravelPlan[],
      deletedLocations: locationData.map(rowToCamelCase) as TravelLocation[],
    };
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 일정 삭제에 실패했습니다.', 500);
  }
};
