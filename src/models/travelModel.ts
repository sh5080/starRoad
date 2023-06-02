import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';

// DB에 여행일정 등록
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
    await connection.execute('INSERT INTO TravelLocation (planId, date, location) VALUES (?,?,?'),
      [travelLocation.planId, travelLocation.date, travelLocation.location];
  } finally {
    connection.release();
  }
};
