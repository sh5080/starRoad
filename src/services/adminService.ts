import * as adminModel from '../models/adminModel';
import { TravelPlan } from '../types/travel';
import { UserType } from '../types/user';
import { Diary } from '../types/diary';
import { Comment } from '../types/comment';
import { AppError, CommonError } from '../types/AppError';
import { TouristDestinationType } from '../types/destination';

// [관리자] 모든 회원 정보 불러오기
export const getAllUsersService = async (): Promise<UserType[]> => {
  try {
    return await adminModel.getAllUsersModel();
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to get all user information', 500);
  }
};

// [관리자] 회원 정보 업데이트
export const updateUserService = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  try {
    const updatedUser = await adminModel.updateUserByIdModel(id, user);
    return updatedUser;
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to update user information', 500);
  }
};

// [관리자] 회원 정보 삭제
export const deleteUserService = async (id: number): Promise<string> => {
  try {
    await adminModel.deleteUserByIdModel(id);
    return '회원 정보가 정상적으로 삭제되었습니다.';
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to delete user information', 500);
  }
};

// [관리자] 회원이 작성한 여행 일정 조회하기
export const getUserInfoTravelService = async (username: string): Promise<TravelPlan[]> => {
  try {
    const travelPlans = await adminModel.getUserInfoTravelModel(username);
    return travelPlans;
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to get user travel plans', 500);
  }
};

// [관리자] 회원이 작성한 여행 장소 날짜 조회하기
export const getUserInfoTravelLocationService = async (plan_id: number): Promise<TravelPlan[]> => {
  try {
    const travelPlans = await adminModel.getUserInfoLocationModel(plan_id);
    return travelPlans;
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to get user travel locations', 500);
  }
};

// [관리자] 회원이 작성한 다이어리 조회하기
export const getUserInfoDiaryService = async (username: string): Promise<Diary[]> => {
  try {
    const travelDiaries = await adminModel.getUserInfoDiaryModel(username);
    return travelDiaries;
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to get user diaries', 500);
  }
};

// [관리자] 회원이 작성한 다이어리 삭제하기
export const deleteDiaryByAdminService = async (username: string, diary_id: number): Promise<string> => {
  try {
    await adminModel.deleteDiaryByAdminModel(username, diary_id);
    return '다이어리가 정상적으로 삭제되었습니다.';
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to delete user diary', 500);
  }
};

// [관리자] 회원이 작성한 다이어리의 모든 댓글 조회하기
export const getUserInfoCommentService = async (username: string, diary_id: number): Promise<Comment[]> => {
  try {
    const diaryComments = await adminModel.getUserInfoDiaryCommentModel(username, diary_id);
    return diaryComments;
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to get user diary comments', 500);
  }
};

// [관리자] 특정 회원이 작성한 모든 댓글 조회하기
export const getUserAllCommentService = async (username: string): Promise<Comment[]> => {
  try {
    const userComments = await adminModel.getUserAllCommentModel(username);
    return userComments;
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to get user comments', 500);
  }
};

// [관리자] 회원이 작성한 댓글 삭제하기
export const deleteCommentByAdminService = async (
  username: string,
  diary_id: number,
  comment_id: number
): Promise<string> => {
  try {
    await adminModel.deleteCommentByAdminModel(username, diary_id, comment_id);
    return '댓글이 정상적으로 삭제되었습니다.';
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to delete user comment', 500);
  }
};

// [관리자] 관광지 추가하기
export const addTouristDestinationService = async (
  name_en: string,
  name_ko: string,
  image: string,
  introduction: string,
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    await adminModel.addTouristDestinationModel(name_en, name_ko, image, introduction, latitude, longitude);
    return '관광지 추가에 성공하였습니다.';
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to add tourist destination', 500);
  }
};

// [관리자] 관광지 수정하기
export const updateTouristDestinationService = async (
  id: string,
  product: Partial<TouristDestinationType>
): Promise<string> => {
  try {
    await adminModel.updateTouristDestinationModel(id, product);
    return '관광지 수정에 성공하였습니다.';
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to update tourist destination', 500);
  }
};

interface TouristDestination {
  [key: string]: any;
  // add other properties if necessary
}
interface DeletedData {
  touristDestination: TouristDestination;
  message: string;
  [key: string]: any; // Optionally allow other string properties
}

// [관리자] 관광지 삭제하기
export const deleteTouristDestinationService = async (id: string): Promise<DeletedData> => {
  try {
    const touristDestination = await adminModel.deleteTouristDestinationModel(id);
    return { message: '관광지 삭제에 성공하였습니다.', touristDestination };
  } catch (error) {
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to delete tourist destination', 500);
  }
};
