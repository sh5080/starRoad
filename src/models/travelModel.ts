import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';

// DB 여행일정 등록
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

// DB에서 여행일정 조회
export const getTravelPlansModel = async (userId: string): Promise<TravelPlan[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM TravelPlan WHERE userId = ?', [userId]);
    return rows as TravelPlan[];
    /**
     * [
    {
        "planId": 1,
        "userId": "user1",
        "startDate": "2023-01-01",
        "endDate": "2023-01-07",
        "destination": "Paris",
        "created_at": "2022-12-01T00:00:00.000Z",
        "updated_at": "2022-12-01T00:00:00.000Z"
    },
    {
        "planId": 2,
        "userId": "user1",
        "startDate": "2023-02-01",
        "endDate": "2023-02-07",
        "destination": "London",
        "created_at": "2022-12-15T00:00:00.000Z",
        "updated_at": "2022-12-15T00:00:00.000Z"
    },
    // ... 추가 여행일정
]
     */
  } finally {
    connection.release(); // connection release
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
