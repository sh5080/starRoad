import { TravelPlan, TravelLocation } from '../types/travel';
import {
  createTravelPlan,
  createTravelLocation,
  getTravelPlansByUserId,
  getTravelLocationsByPlanId,
  updateTravelPlan,
  updateTravelLocation,
  deleteTravelPlan,
  deleteTravelLocation,
} from '../models/travelModel';
import { AppError, CommonError } from '../api/middlewares/errorHandler';

// 여행 일정 등록
export const createPlan = async (travelPlan: TravelPlan) => {
  if (!travelPlan.user_id || !travelPlan.start_date || !travelPlan.end_date || !travelPlan.destination) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }
  const plan_id = await createTravelPlan(travelPlan);
  console.log('plan_id', plan_id);
  return plan_id;
};

// 여행 날짜별 장소 등록
export const createLocation = async (travelLocation: TravelLocation, plan_id: number): Promise<void> => {
  console.log(travelLocation, plan_id);

  if (
    !travelLocation.date ||
    !travelLocation.location ||
    !travelLocation.order ||
    !travelLocation.latitude ||
    !travelLocation.longitude ||
    !plan_id
  ) {
    throw new AppError(CommonError.TOKEN_EXPIRED_ERROR, '여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }
  console.log('여행 장소 등록');
  await createTravelLocation(travelLocation, plan_id);
};

// 여행 일정 조회
export const getPlans = async (user_id: string): Promise<TravelPlan[]> => {
  const travelPlans = await getTravelPlansByUserId(user_id);
  return travelPlans;
};
// 여행 날짜별 장소 조회.
export const getLocations = async (plan_id: number): Promise<TravelLocation[]> => {
  const travelLocations = await getTravelLocationsByPlanId(plan_id);
  return travelLocations;
};

// 여행 일정 수정
export const updatePlan = async (travelPlan: TravelPlan): Promise<void> => {
  if (
    !travelPlan.plan_id ||
    !travelPlan.user_id ||
    !travelPlan.start_date ||
    !travelPlan.end_date ||
    !travelPlan.destination
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await updateTravelPlan(travelPlan);
};

// 여행 날짜별 장소 수정
export const updateLocation = async (travelLocation: TravelLocation): Promise<void> => {
  if (
    !travelLocation.location_id ||
    !travelLocation.plan_id ||
    !travelLocation.location ||
    !travelLocation.newDate ||
    !travelLocation.order
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await updateTravelLocation(travelLocation);
};

// 여행 일정 삭제
export const deletePlan = async (user_id: string, plan_id: number): Promise<void> => {
  await deleteTravelPlan(user_id, plan_id);
};

// 여행 날짜별 장소 삭제
export const deleteLocation = async (travelLocation: TravelLocation): Promise<void> => {
  await deleteTravelLocation(travelLocation);
};
