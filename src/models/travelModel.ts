import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';

export const createTravelPlanModel = async (travelPlan: TravelPlan): Promise<number> => {
  try {
    const [rows] = await db.execute(
      'INSERT INTO travel_plan (user_id, start_date, end_date, destination) VALUES (?, ?, ?, ?)',
      [travelPlan.user_id, travelPlan.start_date, travelPlan.end_date, travelPlan.destination]
    );
    const insertId = (rows as any).insertId;
    return insertId;
  } catch (error) {
    console.error(error);
    throw new Error('여행 일정 등록에 실패했습니다.');
  }
};

export const createTravelLocationModel = async (travelLocation: TravelLocation, plan_id: number): Promise<void> => {
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
    throw new Error('날짜별 장소 등록에 실패했습니다.');
  }
};

export const getTravelPlansModel = async (user_id: string): Promise<TravelPlan[]> => {
  try {
    const [rows] = await db.query('SELECT * FROM travel_plan WHERE user_id = ?', [user_id]);
    return rows as TravelPlan[];
  } catch (error) {
    console.error(error);
    throw new Error('여행 일정 조회에 실패했습니다.');
  }
};

export const getTravelLocationsModel = async (plan_id: number): Promise<TravelLocation[]> => {
  try {
    const [rows] = await db.query('SELECT * FROM travel_location WHERE plan_id = ?', [plan_id]);
    return rows as TravelLocation[];
  } catch (error) {
    console.error(error);
    throw new Error('날짜별 장소 조회에 실패했습니다.');
  }
};

export const updateTravelPlanModel = async (travelPlan: TravelPlan): Promise<void> => {
  try {
    await db.execute(
      'UPDATE travel_plan SET start_date = ?, end_date = ?, destination = ? WHERE plan_id = ? AND user_id = ?',
      [travelPlan.start_date, travelPlan.end_date, travelPlan.destination, travelPlan.plan_id, travelPlan.user_id]
    );
  } catch (error) {
    console.error(error);
    throw new Error('여행 일정 수정에 실패했습니다.');
  }
};

export const updateTravelLocationModel = async (travelLocation: TravelLocation): Promise<void> => {
  try {
    await db.execute(
      'UPDATE travel_location SET location = ?, date = ?, `order` = ? WHERE plan_id = ? AND location_id = ?',
      [
        travelLocation.location,
        travelLocation.newDate,
        travelLocation.order,
        travelLocation.plan_id,
        travelLocation.location_id,
      ]
    );
  } catch (error) {
    console.error(error);
    throw new Error('날짜별 장소 수정에 실패했습니다.');
  }
};

export const deleteTravelPlanModel = async (user_id: string, plan_id: number): Promise<void> => {
  try {
    await db.execute('DELETE FROM travel_location WHERE plan_id = ?', [plan_id]);
    await db.execute('DELETE FROM travel_plan WHERE user_id = ? AND plan_id = ?', [user_id, plan_id]);
  } catch (error) {
    console.error(error);
    throw new Error('여행 일정 삭제에 실패했습니다.');
  }
};

export const deleteTravelLocationModel = async (travelLocation: TravelLocation): Promise<void> => {
  try {
    await db.execute('UPDATE travel_location SET location = NULL WHERE plan_id = ? AND location_id = ?', [
      travelLocation.plan_id,
      travelLocation.location_id,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('날짜별 장소 삭제에 실패했습니다.');
  }
};
