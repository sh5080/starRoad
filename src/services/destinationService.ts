import { AppError, CommonError } from '../types/AppError';
import { TouristDestinationType } from '../types/destination';
import * as destinationModel from '../models/destinationModel';

/** 관광지 모두 조회하기 */

export const getAllTouristDestination = async (): Promise<TouristDestinationType[]> => {
  try {
    const destinations = await destinationModel.getAllTouristDestination();
    return destinations;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destinations', 500);
  }
};

/** 관광지 모두 조회하기 */
export const getTouristDestination = async (id: number): Promise<TouristDestinationType> => {
  try {
    const destination = await destinationModel.getTouristDestination(id);
    return destination;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destination', 500);
  }
};
