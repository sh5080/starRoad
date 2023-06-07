import * as adminModel from '../models/adminModel';
import { TravelPlan } from '../types/travel';
import { UserType } from '../types/user';
import { DiaryType } from '../types/diary';
import { CommentType } from '../types/comment';

// [관리자] 모든 회원 정보 불러오기
export const getAllUsersService = async (): Promise<UserType[]> => {
  return adminModel.getAllUsersModel();
};

// [관리자] 회원 정보 업데이트
export const updateUserService = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  const updatedUser = await adminModel.updateUserByIdModel(id, user);
  return updatedUser;
};

// [관리자] 회원 정보 삭제
export const deleteUserService = async (id: number): Promise<string> => {
  await adminModel.deleteUserByIdModel(id);
  return '회원 정보가 정상적으로 삭제되었습니다.';
};

// [관리자] 회원이 작성한 여행 일정 조회하기
export const getUserInfoTravelService = async (user_id: string): Promise<TravelPlan[]> => {
  const travelPlans = await adminModel.getUserInfoTravelModel(user_id);
  return travelPlans;
};

// [관리자] 회원이 작성한 여행 장소 날짜 조회하기
export const getUserInfoTravelLocationService = async (plan_id: number): Promise<TravelPlan[]> => {
  const travelPlans = await adminModel.getUserInfoLocationModel(plan_id);
  return travelPlans;
};

// [관리자] 회원이 작성한 다이어리 조회하기
export const getUserInfoDiaryService = async (user_id: string): Promise<DiaryType[]> => {
  const travelDiaries = await adminModel.getUserInfoDiaryModel(user_id);
  return travelDiaries;
};

// [관리자] 회원이 작성한 다이어리 삭제하기
export const deleteDiaryByAdminService = async (user_id: string, diary_id: number): Promise<string> => {
  await adminModel.deleteDiaryByAdminModel(user_id, diary_id);
  return '다이어리가 정상적으로 삭제되었습니다.';
};

// [관리자] 회원이 작성한 다이어리의 모든 댓글 조회하기
export const getUserInfoCommentService = async (user_id: string, diary_id: number): Promise<CommentType[]> => {
  const diaryComments = await adminModel.getUserInfoDiaryCommentModel(user_id, diary_id);
  return diaryComments;
};

// [관리자] 특정 회원이 작성한 모든 댓글 조회하기
export const getUserAllCommentService = async (user_id: string): Promise<CommentType[]> => {
  const userComments = await adminModel.getUserAllCommentModel(user_id);
  return userComments;
};

// [관리자] 회원이 작성한 댓글 삭제하기
export const deleteCommentByAdminService = async (
  user_id: string,
  diary_id: number,
  comment_id: number
): Promise<string> => {
  await adminModel.deleteCommentByAdminModel(user_id, diary_id, comment_id);
  return '댓글이 정상적으로 삭제되었습니다.';
};
