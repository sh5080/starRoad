import { TravelPlan, TravelLocation } from '../types/travel';
import * as travelModel from '../models/travelModel';
import { AppError, CommonError } from '../types/AppError';

// 여행 일정 등록
export const createPlan = async (travelPlan: TravelPlan) => {
  if (
    !travelPlan.username?.trim() ||
    !travelPlan.start_date ||
    !travelPlan.end_date ||
    !travelPlan.destination?.trim()
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }
  const plan_id = await travelModel.createTravelPlan(travelPlan);
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
    throw new AppError(CommonError.INVALID_INPUT, '여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  console.log('여행 장소 등록');

  await travelModel.createTravelLocation(travelLocation, plan_id);
};

// 여행 일정 조회
export const getPlans = async (username: string): Promise<TravelPlan[]> => {
  const travelPlans = await travelModel.getTravelPlansByUserId(username);
  return travelPlans;
};
// 여행 날짜별 장소 조회.
export const getLocations = async (plan_id: number): Promise<TravelLocation[]> => {
  const travelLocations = await travelModel.getTravelLocationsByPlanId(plan_id);
  return travelLocations;
};

// 여행 일정 수정
export const updatePlan = async (travelPlan: TravelPlan): Promise<void> => {
  if (
    !travelPlan.plan_id ||
    !travelPlan.username?.trim() ||
    !travelPlan.start_date ||
    !travelPlan.end_date ||
    !travelPlan.destination?.trim()
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await travelModel.updateTravelPlan(travelPlan);
};

// 여행 날짜별 장소 수정
export const updateLocation = async (travelLocation: TravelLocation): Promise<void> => {
  if (
    !travelLocation.location_id ||
    !travelLocation.plan_id ||
    !travelLocation.location?.trim() ||
    !travelLocation.newDate ||
    !travelLocation.order?.toString().trim()
 
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await travelModel.updateTravelLocation(travelLocation);
};

// 여행 일정 삭제
export const deletePlan = async (username: string, plan_id: number): Promise<void> => {


  const deletedPlan = await travelModel.deleteTravelPlan(username, plan_id);
  return deletedPlan
};

// 여행 날짜별 장소 삭제
export const deleteLocation = async (travelLocation: TravelLocation): Promise<void> => {
  await travelModel.deleteTravelLocation(travelLocation);
};
