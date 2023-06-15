import { TravelPlan, TravelLocation } from '../types/travel';
import * as travelModel from '../models/travelModel';
import { AppError, CommonError } from '../types/AppError';
import { RowDataPacket } from 'mysql2';

/**
 * 여행 일정 등록
 */
export const createTravelPlan = async (travelPlan: TravelPlan) => {
  if (
    !travelPlan.username?.trim() ||
    !travelPlan.startDate ||
    !travelPlan.endDate ||
    !travelPlan.destination?.trim()
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 계획에 필요한 정보가 제공되지 않았습니다.', 400);
  }
  const planId = await travelModel.createTravelPlan(travelPlan);
  return planId;
};

/**
 * 여행 날짜별 장소 등록
 */
export const createTravelLocationByPlanId = async (travelLocation: TravelLocation, planId: number): Promise<void> => {
  if (
    !travelLocation.date ||
    !travelLocation.location ||
    !travelLocation.order ||
    !travelLocation.latitude ||
    !travelLocation.longitude ||
    !planId
  ) {
    throw new AppError(CommonError.INVALID_INPUT, '여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }

  await travelModel.createTravelLocationByPlanId(travelLocation, planId);
};

/**
 * 여행 일정 모두 조회
 */
export const getTravelPlansByUsername = async (username: string): Promise<TravelPlan[]> => {
  const travelPlans = await travelModel.getTravelPlansByUsername(username);
  return travelPlans;
};

/**
 * 여행 날짜별 장소 조회.
 */
export const getTravelLocationsByPlanId = async (planId: number): Promise<TravelLocation[]> => {
  const travelLocations = await travelModel.getTravelLocationsByPlanId(planId);
  return travelLocations;
};

/**
 * 여행 일정 상세 조회
 */
export const getTravelPlanDetailsByPlanId  = async (planId: string): Promise<TravelPlan> => {
  const travelPlan = await travelModel.getTravelPlanDetailsByPlanId(planId);
  return travelPlan;
};

/**
 * 여행 날짜별 장소 수정
 */
export const updateLocation = async (
  travelLocation: TravelLocation,
  username: string
): Promise<TravelLocation> => {
  if (
    !travelLocation.locationId ||
    !travelLocation.planId ||
    !travelLocation.location?.trim() ||
    !travelLocation.newDate ||
    !travelLocation.order?.toString().trim() ||
    !travelLocation.latitude ||
    !travelLocation.longitude
  ) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 장소 등록에 필요한 정보가 제공되지 않았습니다.', 400);
  }
  const updatedLocation = await travelModel.updateTravelLocation(username, travelLocation);
  return updatedLocation;
};

/**
 * 여행 일정 삭제
 */
export const deletePlan = async (
  username: string,
  planId: number
): Promise<{ deletedPlan: RowDataPacket[]; deletedLocations: RowDataPacket[] }> => {
  const deletedPlan = await travelModel.deleteTravelPlan(username, planId);
  return deletedPlan;
};
