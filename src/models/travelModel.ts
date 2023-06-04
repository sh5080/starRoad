import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';

// DB 여행일정 등록
/**
 * 예시
 *
 */
export const createTravelPlanModel = async (travelPlan: TravelPlan): Promise<number> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'INSERT INTO travel_plan (user_id, start_date, end_date, destination) VALUES (?, ?, ?, ?)',
      [travelPlan.user_id, travelPlan.start_date, travelPlan.end_date, travelPlan.destination]
    );
    const insertId = (rows as any).insertId;
    return insertId;
  } finally {
    connection.release(); // connection release
  }
};

// DB에 날짜별 장소 등록
export const createTravelLocationModel = async (travelLocation: TravelLocation): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('INSERT INTO travel_location (user_id, plan_id, date, location) VALUES (?, ?, ?, ?)', [
      travelLocation.user_id,
      travelLocation.plan_id,
      travelLocation.date,
      travelLocation.location,
    ]);
  } finally {
    connection.release();
  }
};

// DB에서 여행일정 조회
export const getTravelPlansModel = async (user_id: string): Promise<TravelPlan[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM travel_plan WHERE user_id = ?', [user_id]);
    return rows as TravelPlan[];
  } finally {
    connection.release();
  }
};

// DB에서 여행일정에 해당하는 날짜별 장소 조회
export const getTravelLocationsModel = async (plan_id: number): Promise<TravelLocation[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM travel_location WHERE plan_id = ?', [plan_id]);
    return rows as TravelLocation[];
  } finally {
    connection.release();
  }
};

// DB에 여행 일정 수정
export const updateTravelPlanModel = async (travelPlan: TravelPlan): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      'UPDATE travel_plan SET start_date = ?, end_date = ?, destination = ? WHERE plan_id = ? AND user_id = ?',
      [travelPlan.start_date, travelPlan.end_date, travelPlan.destination, travelPlan.plan_id, travelPlan.user_id]
    );
  } finally {
    connection.release();
  }
};

// 날짜별 장소 수정
export const updateTravelLocationModel = async (travelLocation: TravelLocation): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE travel_location SET location = ? WHERE plan_id = ? AND date = ? AND user_id = ?', [
      travelLocation.location,
      travelLocation.plan_id,
      travelLocation.date,
      travelLocation.user_id,
    ]);
  } finally {
    connection.release();
  }
};

// 여행 일정 삭제
export const deleteTravelPlanModel = async (user_id: string, plan_id: number): Promise<void> => {
  const connection = await db.getConnection();
  try {
    // Delete from TravelLocation table first
    await connection.execute('DELETE FROM travel_location WHERE plan_id = ?', [plan_id]);
    // Then delete from TravelPlan table
    await connection.execute('DELETE FROM travel_plan WHERE user_id = ? AND plan_id = ?', [user_id, plan_id]);
  } finally {
    connection.release();
  }
};

// 특정일정 특정날짜별 장소 삭제 (사실상 장소를 null로 설정)
export const deleteTravelLocationModel = async (plan_id: number, date: string): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE travel_location SET location = NULL WHERE plan_id = ? AND date = ?', [plan_id, date]);
  } finally {
    connection.release();
  }
};
