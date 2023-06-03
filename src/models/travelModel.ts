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
      'INSERT INTO TravelPlan (userId, startDate, endDate, destination) VALUES (?, ?, ?, ?)',
      [travelPlan.userId, travelPlan.startDate, travelPlan.endDate, travelPlan.destination]
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
    await connection.execute('INSERT INTO TravelLocation (userId, planId, date, location) VALUES (?, ?, ?, ?)', [
      travelLocation.userId,
      travelLocation.planId,
      travelLocation.date,
      travelLocation.location,
    ]);
  } finally {
    connection.release();
  }
};

// DB에서 여행일정 조회
export const getTravelPlansModel = async (userId: string): Promise<TravelPlan[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM TravelPlan WHERE userId = ?', [userId]);
    return rows as TravelPlan[];
  } finally {
    connection.release();
  }
};

// DB에서 여행일정에 해당하는 날짜별 장소 조회
export const getTravelLocationsModel = async (planId: number): Promise<TravelLocation[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM TravelLocation WHERE planId = ?', [planId]);
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
      'UPDATE TravelPlan SET startDate = ?, endDate = ?, destination = ? WHERE planId = ? AND userId = ?',
      [travelPlan.startDate, travelPlan.endDate, travelPlan.destination, travelPlan.planId, travelPlan.userId]
    );
  } finally {
    connection.release();
  }
};

// 날짜별 장소 수정
export const updateTravelLocationModel = async (travelLocation: TravelLocation): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE TravelLocation SET location = ? WHERE planId = ? AND date = ? AND userId = ?', [
      travelLocation.location,
      travelLocation.planId,
      travelLocation.date,
      travelLocation.userId,
    ]);
  } finally {
    connection.release();
  }
};

// 여행 일정 삭제
export const deleteTravelPlanModel = async (userId: string, planId: number): Promise<void> => {
  const connection = await db.getConnection();
  try {
    // Delete from TravelLocation table first
    await connection.execute('DELETE FROM TravelLocation WHERE planId = ?', [planId]);
    // Then delete from TravelPlan table
    await connection.execute('DELETE FROM TravelPlan WHERE userId = ? AND planId = ?', [userId, planId]);
  } finally {
    connection.release();
  }
};

// 특정일정 특정날짜별 장소 삭제 (사실상 장소를 null로 설정)
export const deleteTravelLocationModel = async (planId: number, date: string): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE TravelLocation SET location = NULL WHERE planId = ? AND date = ?', [planId, date]);
  } finally {
    connection.release();
  }
};
