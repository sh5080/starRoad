import { TravelPlan, TravelLocation } from '../types/travel';
import * as travelModel from '../models/travelModel';
import { AppError, CommonError } from '../types/AppError';
import { RowDataPacket } from 'mysql2';

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
  return plan_id;
};

// 여행 날짜별 장소 등록
export const createLocation = async (travelLocation: TravelLocation, plan_id: number): Promise<void> => {
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

  await travelModel.createTravelLocation(travelLocation, plan_id);
};

// 여행 일정 모두 조회
export const getPlans = async (username: string): Promise<TravelPlan[]> => {
  const travelPlans = await travelModel.getTravelPlansByUsername(username);
  return travelPlans;
};

// 여행 날짜별 장소 조회.
export const getLocations = async (plan_id: number): Promise<TravelLocation[]> => {
  const travelLocations = await travelModel.getTravelLocationsByPlanId(plan_id);
  return travelLocations;
};

// 여행 일정 상세 조회
export const getPlan = async (plan_id: string): Promise<TravelPlan> => {
  const travelPlans = await travelModel.getTravelPlanByPlanId(plan_id);
  return travelPlans;
};
// // 여행 일정 수정
// export const updatePlan = async (username: string, travelPlan: TravelPlan) => {
//   if (
//     !travelPlan.plan_id ||
//     !travelPlan.username?.trim() ||
//     !travelPlan.start_date ||
//     !travelPlan.end_date ||
//     !travelPlan.destination?.trim()
//   ) {
//     throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
//   }
//   const existingTravelPlans = await travelModel.getTravelPlansByUserId(username);
//   const existingTravelPlan = existingTravelPlans.find((plan) => plan.plan_id === travelPlan.plan_id);

//   if (!existingTravelPlan || existingTravelPlan.username !== username) {
//     throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '권한이 없습니다.', 403);
//   }

//   await travelModel.updateTravelPlan(travelPlan);
//   return travelPlan;
// };

// 여행 날짜별 장소 수정
export const updateLocation = async (travelLocation: TravelLocation, username: string): Promise<TravelLocation> => {
  if (
    !travelLocation.location_id ||
    !travelLocation.plan_id ||
    !travelLocation.location?.trim() ||
    !travelLocation.newDate ||
    !travelLocation.order?.toString().trim() ||
    !travelLocation.latitude ||
    !travelLocation.longitude
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }
  const updateLocation = await travelModel.updateTravelLocation(username, travelLocation);
  return updateLocation;
};

// 여행 일정 삭제
export const deletePlan = async (
  username: string,
  plan_id: number
): Promise<{ deletedPlan: RowDataPacket[]; deletedLocations: RowDataPacket[] }> => {
  const deletedPlan = await travelModel.deleteTravelPlan(username, plan_id);
  return deletedPlan;
};

// // 여행 날짜별 장소 삭제

// export const deleteLocation = async (
//   location_id: number,
//   travelLocation: TravelLocation
// ): Promise<{ deletedLocations: RowDataPacket[] }> => {
//   const deletedLocations = await travelModel.deleteTravelLocation(location_id,travelLocation);
//   return deletedLocations;
// };
