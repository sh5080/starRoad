import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { AppError,CommonError } from '../types/AppError';

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
    throw new AppError(CommonError.UNEXPECTED_ERROR,'일정 생성에 실패했습니다.',500)
  }
};

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
    throw new AppError(CommonError.UNEXPECTED_ERROR,'날짜 및 장소 생성에 실패했습니다.',500)
  }
};

export const getTravelPlansByUserId = async (username: string): Promise<TravelPlan[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_plan WHERE username = ?', [username]);
    return rows as TravelPlan[];
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR,'여행 일정 조회에 실패했습니다.',500);
  }
};

export const getTravelLocationsByPlanId = async (plan_id: number): Promise<TravelLocation[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_location WHERE plan_id = ?', [plan_id]);
    return rows as TravelLocation[];
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR,'날짜별 장소 조회에 실패했습니다.',500);
  }
};

export const updateTravelPlan = async (travelPlan: TravelPlan): Promise<void> => {
  try {


    await db.execute(
      'UPDATE travel_plan SET start_date = ?, end_date = ?, destination = ? WHERE plan_id = ? AND username = ?',
      [travelPlan.start_date, travelPlan.end_date, travelPlan.destination, travelPlan.plan_id, travelPlan.username]
    );
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR,'여행 일정 수정에 실패했습니다.',500);
  }
};

export const updateTravelLocation = async (username: string, travelLocation: TravelLocation): Promise<{myLocation:RowDataPacket[],myPlan:RowDataPacket[]}> => {
  try {
    const [myPlan] = await db.execute(
      'SELECT * FROM travel_plan WHERE plan_id = ? AND username = ?',
      [travelLocation.plan_id, username]
    )as [RowDataPacket[],FieldPacket[]];
    const [myLocation] = await db.execute(
      'SELECT * FROM travel_location WHERE location_id = ?',
      [travelLocation.location_id]
    )as [RowDataPacket[],FieldPacket[]];

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
    return {myLocation,myPlan}
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR,'날짜별 장소 수정에 실패했습니다.',500);
  }
};

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
    throw new AppError(CommonError.UNEXPECTED_ERROR,'여행 일정 삭제에 실패했습니다.',500);
  }
};

export const deleteTravelLocation = async (
  location_id:number,
  travelLocation: TravelLocation
  ): Promise<{deletedLocations:RowDataPacket[]}> => {
  try {
    const [locationData] = (await db.execute('SELECT * FROM travel_location WHERE location_id = ?', [
      location_id, 
    ])) as [
      RowDataPacket[],
      FieldPacket[]
    ];
    await db.execute('UPDATE travel_location SET location = NULL WHERE plan_id = ? AND location_id = ?', [
      travelLocation.plan_id,
      travelLocation.location_id,
    ])
return {
  deletedLocations: locationData
}


  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR,'날짜별 장소 삭제에 실패했습니다.',500);
  }
};
