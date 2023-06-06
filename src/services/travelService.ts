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
import { AppError, CommonError } from '../api/middlewares/errorHandler';

// 여행 일정 등록
export const createTravelPlan = async (travelPlan: TravelPlan) => {
  if (!travelPlan.user_id || !travelPlan.start_date || !travelPlan.end_date || !travelPlan.destination) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND,'여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  const plan_id = await createTravelPlanModel(travelPlan);
  return plan_id;
};

// 여행 날짜별 장소 등록
export const createTravelLocation = async (travelLocation: TravelLocation): Promise<void> => {
  
  if (!travelLocation.user_id || !travelLocation.plan_id || !travelLocation.date || !travelLocation.location) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND,'여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await createTravelLocationModel(travelLocation);
};


// 여행 일정 조회
export const getTravelPlans = async (user_id: string): Promise<TravelPlan[]> => {
  const travelPlans = await getTravelPlansModel(user_id);
  return travelPlans;
};
// 여행 날짜별 장소 조회.
export const getTravelLocations = async (plan_id: number): Promise<TravelLocation[]> => {
  const travelLocations = await getTravelLocationsModel(plan_id);
  return travelLocations;
};

// 여행 일정 수정
export const updateTravelPlan = async (travelPlan: TravelPlan): Promise<void> => {
  if (
    !travelPlan.plan_id ||
    !travelPlan.user_id ||
    !travelPlan.start_date ||
    !travelPlan.end_date ||
    !travelPlan.destination
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND,'여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await updateTravelPlanModel(travelPlan);
};

// 여행 날짜별 장소 수정
export const updateTravelLocation = async (
  user_id: string,
  plan_id: number,
  date: string,
  newDate: string,
  location: string
): Promise<void> => {
  if (!user_id || !plan_id || !date || !location || !newDate) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND,'여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await updateTravelLocationModel({ user_id, plan_id, date, newDate, location });
};

// 여행 일정 삭제
export const deleteTravelPlan = async (user_id: string, plan_id: number): Promise<void> => {
  await deleteTravelPlanModel(user_id, plan_id);
};

// 여행 날짜별 장소 삭제
export const deleteTravelLocation = async (plan_id: number, date: string): Promise<void> => {
  await deleteTravelLocationModel(plan_id, date);
};
