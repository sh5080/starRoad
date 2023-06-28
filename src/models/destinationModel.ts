import { FieldPacket, RowDataPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { TouristDestinationType } from '../types/destination';
import { AppError, CommonError } from '../types/AppError';
import { rowToCamelCase } from '../util/rowToCamelCase';

/** 관광지 전부 조회하기 */
export const getAllTouristDestination = async (): Promise<TouristDestinationType[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM travel_destination');

    return rows.map(rowToCamelCase);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '관광지 조회에 실패했습니다.', 500);
    }
  }
};

/** 관광지 상세 조회하기 */
export const getTouristDestination = async (id: number): Promise<TouristDestinationType> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM travel_destination WHERE id = ?', [
      id,
    ]);

    return rowToCamelCase(rows[0]);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '관광지 조회에 실패했습니다.', 500);
    }
  }
};
