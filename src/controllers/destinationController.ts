import { CustomRequest } from '../types/customRequest';
import { Response, NextFunction } from 'express';
import * as destinationService from '../services/destinationService';

// 관광지 모두 조회하기
export const getAllTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const destinations = await destinationService.getAllTouristDestination();
    const destinationCount: number = destinations.length;

    res.status(200).json({ data: { destinations, destinationCount, message: '모든 여행지를 불러왔습니다.' } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 관광지 상세 조회하기
export const getTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;

    const destination = await destinationService.getTouristDestination(Number(location_id));

    res.status(200).json({ data: { destination, message: '여행지 상세 조회를 완료했습니다.' } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
