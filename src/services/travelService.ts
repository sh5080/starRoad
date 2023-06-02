import { TravelPlan, TravelLocation } from '../types/travel';
import {
  createTravelPlanModel,
  createTravelLocationModel,
  getTravelPlansModel,
  getTravelLocationsModel,
} from '../models/travelModel';
import { AppError } from '../api/middlewares/errorHandler';

// 여행 일정 등록
export const createTravelPlan = async (travelPlan: TravelPlan) => {
  if (!travelPlan.userId || !travelPlan.startDate || !travelPlan.endDate || !travelPlan.destination) {
    throw new AppError('여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  const planId = await createTravelPlanModel(travelPlan);
  return planId;
};

// 여행 날짜별 장소 등록
export const createTravelLocation = async (travelLocation: TravelLocation): Promise<void> => {
  if (!travelLocation.planId || !travelLocation.date || !travelLocation.location) {
    throw new AppError('여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await createTravelLocationModel(travelLocation);
};

// 여행 일정 조회
export const getTravelPlans = async (userId: string): Promise<TravelPlan[]> => {
  const travelPlans = await getTravelPlansModel(userId);
  return travelPlans;
};
// 여행 날짜별 장소 조회.
export const getTravelLocations = async (planId: number): Promise<TravelLocation[]> => {
  const travelLocations = await getTravelLocationsModel(planId);
  return travelLocations;
};
