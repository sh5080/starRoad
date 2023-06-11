import { AppError, CommonError } from '../types/AppError';
import { TouristDestinationType } from '../types/destination';
import * as destinationModel from '../models/destinationModel';

// 관광지 모두 조회하기

export const getAllTouristDestinationService = async (): Promise<TouristDestinationType[]> => {
  try {
    console.log('모든 여행지 정보를 가져오는 중...');
    const destinations = await destinationModel.getAllTouristDestinationModel();
    return destinations;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destinations', 500);
  }
};

// 관광지 상세 조회하기
export const getTouristDestinationService = async (id: number): Promise<TouristDestinationType> => {
  try {
    console.log('특정 관광지 정보를 가져오는 중...');
    const destination = await destinationModel.getTouristDestinationModel(id);
    return destination;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch tourist destination', 500);
  }
};
