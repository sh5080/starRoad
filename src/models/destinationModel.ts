import { RowDataPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { TouristDestinationType } from '../types/destination';
import { AppError, CommonError } from '../types/AppError';
import { rowToCamelCase } from '../util/rowToCamelCase';

/** 관광지 전부 조회하기 */
export const getAllTouristDestination = async (): Promise<TouristDestinationType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_destination');

    return (rows as RowDataPacket[]).map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destinations', 500);
  }
};

/** 관광지 상세 조회하기 */
export const getTouristDestination = async (id: number): Promise<TouristDestinationType> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_destination WHERE id = ?', [id]);

    return rowToCamelCase((rows as RowDataPacket[])[0]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destination', 500);
  }
};
