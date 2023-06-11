import { CustomRequest } from '../types/customRequest';
import { Response, NextFunction } from 'express';
import { AppError, CommonError } from '../types/AppError';
import * as destinationService from '../services/destinationService';

// 관광지 모두 조회하기
export const getAllTouristDestinationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const destinations = await destinationService.getAllTouristDestinationService();
    const destinationCount: number = destinations.length;

    res.status(200).json({ data: { destinations, destinationCount, message: '모든 여행지를 불러왔습니다.' } });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '여행지 정보 조회에 실패했습니다.', 500));
  }
};

// 관광지 상세 조회하기
export const getTouristDestinationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;

    const destination = await destinationService.getTouristDestinationService(Number(location_id));

    res.status(200).json({ data: { destination, message: '여행지 상세 조회를 완료했습니다.' } });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '여행지 상세 조회에 실패했습니다.', 500));
  }
};
