import { TravelPlan, TravelLocation } from '../types/travel';
import { AppError } from '../api/middlewares/errorHandler';
import { Request, Response } from 'express';
import { createTravelPlan, createTravelLocation, getTravelPlans, getTravelLocations } from '../services/travelService';
import { JwtPayload } from 'jsonwebtoken';

// 여행 일정 등록
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

interface CustomRequest extends Request {
  user?: JwtPayload & { userId: string };
}

// 여행 일정 조회
export const getTravelPlanController = async (req: CustomRequest, res: Response) => {
  try {
    // req.user가 없는 경우 에러 처리
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }
    const { userId } = req.user;

    // 내 여행 일정 조회 해서 여행 일정 데이터에 있는 planId 를 통해서 장소 데이터 조회
    const travelPlanData = await getTravelPlans(userId); // 여행 일정 데이터

    if (!travelPlanData) {
      return res.status(404).json({ error: '여행 일정을 찾을 수 없습니다.' });
    }

    for (const plan of travelPlanData) {
      // planId가 정의되어 있으면 해당 장소 정보를 조회합니다.
      if (plan.planId !== undefined) {
        plan.locations = await getTravelLocations(plan.planId);
      }
    }
		
    res.status(200).json({ travelPlanData });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '여행 일정 조회에 실패했습니다.' });
    }
  }
};
