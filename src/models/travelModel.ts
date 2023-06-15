import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { AppError, CommonError } from '../types/AppError';

/**
 * 여행 일정 생성
 */
export const createTravelPlan = async (travelPlan: TravelPlan) => {
  try {
    const [rows] = await db.execute(
      'INSERT INTO travel_plan (username, start_date, end_date, destination) VALUES (?, ?, ?, ?)',
      [travelPlan.username, travelPlan.start_date, travelPlan.end_date, travelPlan.destination]
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
export const createTravelLocation = async (travelLocation: TravelLocation, plan_id: number): Promise<void> => {
  try {
    await db.execute(
      'INSERT INTO travel_location (plan_id, date, location, `order`, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
      [
        plan_id,
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
    return rows as TravelPlan[];
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 일정 조회에 실패했습니다.', 500);
  }
};

/**
 * 특정 여행 일정의 모든 장소 조회
 */
export const getTravelLocationsByPlanId = async (plan_id: number): Promise<TravelLocation[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_location WHERE plan_id = ? ORDER BY date ASC, `order` ASC', [
      plan_id,
    ]);
    return rows as TravelLocation[];
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '날짜별 장소 조회에 실패했습니다.', 500);
  }
};

/**
 * 특정 여행 일정 조회
 */
export const getTravelPlanByPlanId = async (plan_id: string): Promise<TravelPlan> => {
  try {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM travel_plan WHERE plan_id = ?', [plan_id]);
    return rows[0] as unknown as TravelPlan;
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
    // Perform the update query
    await db.execute(
      'UPDATE travel_location SET location = ?, date = ?, `order` = ?, latitude = ?, longitude = ? WHERE plan_id = ? AND location_id = ?',
      [
        travelLocation.location,
        travelLocation.newDate,
        travelLocation.order,
        travelLocation.latitude,
        travelLocation.longitude,
        travelLocation.plan_id,
        travelLocation.location_id,
      ]
    );

    const [rawLocation] = (await db.execute('SELECT * FROM travel_location WHERE location_id = ?', [
      travelLocation.location_id,
    ])) as [RowDataPacket[], FieldPacket[]];

    // Convert rawLocation (a RowDataPacket) to TravelLocation type
    let updatedLocation: TravelLocation = {
      location_id: rawLocation[0].location_id,
      plan_id: rawLocation[0].plan_id,
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
 * 사용자별 일정 삭제
 */
export const deleteTravelPlan = async (
  username: string,
  plan_id: number
): Promise<{ deletedPlan: RowDataPacket[]; deletedLocations: RowDataPacket[] }> => {
  try {
    const [planData] = (await db.execute('SELECT * FROM travel_plan WHERE username = ? AND plan_id = ?', [
      username,
      plan_id,
    ])) as [RowDataPacket[], FieldPacket[]];

    const [locationData] = (await db.execute('SELECT * FROM travel_location WHERE plan_id = ?', [plan_id])) as [
      RowDataPacket[],
      FieldPacket[]
    ];

    await db.execute('DELETE FROM travel_location WHERE plan_id = ?', [plan_id]);
    await db.execute('DELETE FROM travel_plan WHERE username = ? AND plan_id = ?', [username, plan_id]);

    return {
      deletedPlan: planData,
      deletedLocations: locationData,
    };
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 일정 삭제에 실패했습니다.', 500);
  }
};
