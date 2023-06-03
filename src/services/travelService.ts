import { TravelPlan, TravelLocation } from '../types/travel';
import {
  createTravelPlanModel,
  createTravelLocationModel,
  getTravelPlansModel,
  getTravelLocationsModel,
  updateTravelPlanModel,
  updateTravelLocationModel,
  deleteTravelPlanModel,
  deleteTravelLocationModel,
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
  if (!travelLocation.userId || !travelLocation.planId || !travelLocation.date || !travelLocation.location) {
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

// 여행 일정 수정
export const updateTravelPlan = async (travelPlan: TravelPlan): Promise<void> => {
  if (
    !travelPlan.planId ||
    !travelPlan.userId ||
    !travelPlan.startDate ||
    !travelPlan.endDate ||
    !travelPlan.destination
  ) {
    throw new AppError('여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }
  console.log(travelPlan);

  await updateTravelPlanModel(travelPlan);
};

// 여행 날짜별 장소 수정
export const updateTravelLocation = async (
  userId: string,
  planId: number,
  date: string,
  location: string
): Promise<void> => {
  if (!userId || !planId || !date || !location) {
    throw new AppError('여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await updateTravelLocationModel({ userId, planId, date, location });
};

// 여행 일정 삭제
export const deleteTravelPlan = async (userId: string, planId: number): Promise<void> => {
  await deleteTravelPlanModel(userId, planId);
};

// 여행 날짜별 장소 삭제
export const deleteTravelLocation = async (planId: number, date: string): Promise<void> => {
  await deleteTravelLocationModel(planId, date);
};
