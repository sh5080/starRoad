import { TravelPlan, TravelLocation } from '../types/travel';
import { AppError } from '../api/middlewares/errorHandler';
import { Request, Response } from 'express';
import { createTravelPlan, createTravelLocation } from '../services/travelService';

// 여행 일정 API
export const createTravelPlanController = async (req: Request, res: Response) => {
  const travelPlan: TravelPlan = req.body;
  const travelLocations: TravelLocation[] = req.body.locations;

  try {
    // 여행 일정 등록
    const planId = Number(await createTravelPlan(travelPlan));

    // 각 날짜별 장소 등록
    for (const location of travelLocations) {
      await createTravelLocation({ ...location, planId });
    }

    res.status(201).json({ message: '여행 계획 및 장소가 성공적으로 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: '여행 계획 및 장소 등록에 실패했습니다.' });
  }
};

