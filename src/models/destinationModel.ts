import { RowDataPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { TouristDestinationType } from '../types/destination';
import { AppError, CommonError } from '../types/AppError';

// 관광지 전부 조회하기
export const getAllTouristDestinationModel = async (): Promise<TouristDestinationType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_destination');
    const touristDestinations = rows as TouristDestinationType[];

    return touristDestinations;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destinations', 500);
  }
};

// 관광지 상세 조회하기
export const getTouristDestinationModel = async (id: number): Promise<TouristDestinationType> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_destination WHERE id = ?', [id]);
    const touristDestination = (rows as RowDataPacket[])[0] as TouristDestinationType;

    return touristDestination;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destination', 500);
  }
};
