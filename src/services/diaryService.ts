import * as diaryModel from '../models/diaryModel';
import { Diary } from '../types/diary';
import { AppError, CommonError } from '../types/AppError';

/**
 * 여행기 생성
 */
export const createDiary = async (diary: Diary, plan: Diary) => {
  try {
    const { destination } = plan;
    diary.destination = destination;

    await diaryModel.createDiary(diary, plan);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 생성에 실패했습니다.', 500);
  }
};
export const getPlanByIdAndUsername = async (planId: number, username: string) => {
  try {
    const plan = await diaryModel.getPlan(planId, username);
    return plan;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '일정 정보를 가져오는데 실패했습니다.', 500);
  }
};

/**
 * 전체 여행기 조회
 */
export const getAllDiaries = async (): Promise<Diary[]> => {
  try {
    const diaries = await diaryModel.getAllDiariesByUsername();
    return diaries;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '전체 여행기 조회에 실패했습니다.', 500);
  }
};

/**
 * 내 다이어리 조회
 */
export const getMyDiaries = async (username: string): Promise<Diary[]> => {
  try {
    const diaries = await diaryModel.getMyDiariesByUsername(username);
    if (!diaries) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    return diaries;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '내 여행기 조회에 실패했습니다.', 500);
  }
};

/**
 * 특정 여행기 조회
 */
export const getOneDiaryByDiaryId = async (diaryId: number): Promise<Diary | null> => {
  try {
    const diary = await diaryModel.getOneDiaryByDiaryId(diaryId);
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 조회에 실패했습니다.', 500);
  }
};

/**
 * 여행기 수정
 */
export const updateDiary = async (newDiary: Diary, diaryId: number, username: string) => {
  try {
    const diary = await diaryModel.getOneDiaryByDiaryId(diaryId);
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    if (typeof diary.planId === 'undefined') {
      throw new AppError(CommonError.INVALID_INPUT, '여행기의 일정 정보가 없습니다.', 400);
    }

    await diaryModel.updateDiaryByUsername(newDiary, diaryId);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 수정에 실패했습니다.', 500);
  }
};

/**
 * 여행기 삭제
 */
export const deleteDiary = async (diaryId: number, username: string) => {
  try {
    const diary = await diaryModel.getOneDiaryByDiaryId(diaryId);
      console.log(diary)

    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기 찾을 수 없습니다.', 404);
    }
    if(diary.username !== username){
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '권한이 없습니다.', 403);
    }
    await diaryModel.deleteDiaryByUsername(diaryId);

    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 삭제 실패했습니다.', 500);
  }
};
