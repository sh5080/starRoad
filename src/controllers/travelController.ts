import { TravelPlan, TravelLocation } from '../types/travel';
import { AppError } from '../api/middlewares/errorHandler';
import { Request, Response } from 'express';
import {
  createTravelPlan,
  createTravelLocation,
  getTravelPlans,
  getTravelLocations,
  updateTravelPlan,
  updateTravelLocation,
  deleteTravelPlan,
  deleteTravelLocation,
} from '../services/travelService';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload & { userId: string };
}

// 여행 일정 등록 + 날짜별 장소 등록
export const createTravelPlanController = async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('인증이 필요합니다.', 401);
  }
  try {
    const { locations, ...travelPlan } = req.body;
    const { userId } = req.user;

    // 여행 일정 등록
    const planId = Number(await createTravelPlan(travelPlan));
    // 각 날짜별 장소 등록
    for (const location of locations) {
      await createTravelLocation({ ...location, userId, planId });
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

// 여행 일정 조회
export const getTravelPlanController = async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('인증이 필요합니다.', 401);
  }
  try {
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

interface CustomRequest extends Request {
  user?: JwtPayload & { userId: string };
}

// 여행 일정 수정
export const updateTravelPlanController = async (req: CustomRequest, res: Response) => {
  // 로그인 확인
  if (!req.user) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const { planId } = req.params;
    const { startDate, endDate, destination } = req.body;
    const { userId } = req.user;

    // 여행 일정 수정
    await updateTravelPlan({
      planId: Number(planId),
      userId,
      startDate,
      endDate,
      destination,
      locations: [],
    });

    res.status(200).json({ message: '여행 일정이 성공적으로 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '여행 일정 수정에 실패했습니다.' });
    }
  }
};

// 특정 날짜 특정 장소 수정
export const updateTravelLocationController = async (req: CustomRequest, res: Response) => {
  // 로그인 확인
  if (!req.user) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const { userId } = req.user;
    const { planId, date } = req.params;
    const { location } = req.body;

    // 각 날짜별 장소 수정
    await updateTravelLocation(userId, Number(planId), date, location);

    res.status(200).json({ message: '여행 장소가 성공적으로 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '여행 장소 수정에 실패했습니다.' });
    }
  }
};

// 여행 일정 삭제
export const deleteTravelPlanController = async (req: CustomRequest, res: Response) => {
  // 로그인 확인
  if (!req.user) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const { userId } = req.user;
    const { planId } = req.params;

    await deleteTravelPlan(userId, Number(planId));

    res.status(200).json({ message: '여행 일정이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '여행 일정 삭제에 실패했습니다.' });
    }
  }
};

// 특정 일정의 특정 날짜 장소 삭제
export const deleteTravelLocationController = async (req: CustomRequest, res: Response) => {
  // 로그인 확인
  if (!req.user) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const { planId, date } = req.params;
    console.log(planId, date);

    // 특정 날짜의 장소 삭제
    await deleteTravelLocation(Number(planId), date);

    res.status(200).json({ message: '해당 날짜의 여행 장소가 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '여행 장소 삭제에 실패했습니다.' });
    }
  }
};
