import * as adminModel from '../models/adminModel';
import { TravelPlan } from '../types/travel';
import { UserType } from '../types/user';
import { Diary } from '../types/diary';
import { Comment } from '../types/comment';
import { AppError, CommonError } from '../types/AppError';
import { TouristDestinationType } from '../types/destination';
interface TouristDestination {
  [key: string]: any;
  // add other properties if necessary
}
interface DeletedData {
  touristDestination: TouristDestination;
  message: string;
  [key: string]: any; // Optionally allow other string properties
}

// [관리자] 모든 회원 정보 불러오기
export const getAllUsers = async (): Promise<UserType[]> => {
  try {
    return await adminModel.getAllUsers();
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '회원정보 불러오기에 실패했습니다.', 500);
  }
};

// [관리자] 회원 정보 업데이트
export const updateUser = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  try {
    const updatedUser = await adminModel.updateUserById(id, user);
    return updatedUser;
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '회원정보 수정에 실패했습니다.', 500);
  }
};

// [관리자] 회원 정보 삭제
export const deleteUser = async (id: number)=> {
  try {
    await adminModel.deleteUserById(id);
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '회원정보 삭제에 실패했습니다.', 500);
  }
};

// [관리자] 회원이 작성한 여행 일정 조회하기
export const getAllTravelPlansByUsername = async (username: string): Promise<TravelPlan[]> => {
  try {
    const travelPlans = await adminModel.getAllTravelPlansByUsername(username);
    return travelPlans;
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '일정 조회에 실패했습니다.', 500);
  }
};

// [관리자] 회원이 작성한 여행 장소 날짜 조회하기
export const getAllLocationsByPlanId = async (planId: number): Promise<TravelPlan[]> => {
  try {
    const travelPlans = await adminModel.getAllLocationsByPlanId(planId);
    return travelPlans;
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '여행장소, 날짜 조회에 실패했습니다.', 500);
  }
};

// [관리자] 회원이 작성한 다이어리 조회하기
export const getAllDiariesByUsername = async (username: string): Promise<Diary[]> => {
  try {
    const travelDiaries = await adminModel.getAllDiariesByUsername(username);
    return travelDiaries;
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '여행기 조회에 실패했습니다.', 500);
  }
};

// [관리자] 회원이 작성한 다이어리 삭제하기
export const deleteDiaryByUsernameAndDiaryId = async (username: string, diaryId: number) => {
  try {
    await adminModel.deleteDiaryByUsernameAndDiaryId(username, diaryId);
    
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '여행기 삭제에 실패했습니다.', 500);
  }
};

// [관리자] 회원이 작성한 다이어리의 모든 댓글 조회하기
export const getAllCommentsByUsernameAndDiaryId = async (username: string, diaryId: number): Promise<Comment[]> => {
  try {
    const diaryComments = await adminModel.getAllCommentsByUsernameAndDiaryId(username, diaryId);
    return diaryComments;
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '해당 사용자의 특정 여행기 댓글 조회에 실패했습니다.', 500);
  }
};

// [관리자] 특정 회원이 작성한 모든 댓글 조회하기
export const getAllCommentsByUsername = async (username: string): Promise<Comment[]> => {
  try {
    const userComments = await adminModel.getAllCommentsByUsername(username);
    return userComments;
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '특정 사용자 댓글 조회에 실패했습니다.', 500);
  }
};

// [관리자] 회원이 작성한 댓글 삭제하기
export const deleteCommentByUsernameAndDiaryId = async (
  username: string,
  diaryId: number,
  commentId: number
) => {
  try {
    await adminModel.deleteCommentByUsernameAndDiaryId(username, diaryId, commentId);
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '댓글 삭제에 실패했습니다.', 500);
  }
};

// [관리자] 관광지 추가하기
export const addTouristDestination = async (
  nameEn: string,
  nameKo: string,
  image: string,
  introduction: string,
  latitude: number,
  longitude: number
) => {
  try {
    await adminModel.addTouristDestination(nameEn, nameKo, image, introduction, latitude, longitude);
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '관광지 추가에 실패하였습니다.', 500);
  }
};

// [관리자] 관광지 수정하기
export const updateTouristDestination = async (
  id: string,
  product: Partial<TouristDestinationType>
) => {
  try {
    if (!id) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '관광지를 찾을 수 없습니다.', 400);
    }
    await adminModel.updateTouristDestination(id, product);
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '관광지 수정에 실패하였습니다.', 500);
  }
};

// [관리자] 관광지 삭제하기
export const deleteTouristDestination = async (id: string): Promise<DeletedData> => {
  try {
    const touristDestination = await adminModel.deleteTouristDestination(id);
    if (!touristDestination) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '이미 삭제되었거나 없는 관광지입니다.', 404);
    }
    return { message: '관광지 삭제에 성공하였습니다.', touristDestination };
  } catch (error) {
    console.error(error)
    throw new AppError(CommonError.SERVER_ERROR, '관광지 삭제에 실패하였습니다.', 500);
  }
};
