import * as diaryModel from '../models/diaryModel';
import { Diary } from '../types/diary';
import { AppError,CommonError } from "../types/AppError";


export const createDiary = async (
  diary: Diary, 
  username: string, 
  plan_id: number
  ) => {
    const plan = await diaryModel.getPlan(plan_id, username);

    if (!plan) {
      throw new AppError(CommonError.INVALID_INPUT, '나의 일정만 여행기를 등록할 수 있습니다.', 404);
    }
    const { destination } = plan; // 일정의 destination 값
    diary.destination = destination;
    
    const { title, content, image } = diary
    diary.title = title
    diary.content = content
    diary.image = image

    await diaryModel.createDiaryByUsername(diary, plan);
    
    return diary
    
};

export const getAllDiaries = async (): Promise<Diary[]> => {
  try {
    const diaries = await diaryModel.getAllDiariesByUsername();
    return diaries;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '전체 여행기 조회에 실패했습니다.', 500);
  }
};
export const getMyDiaries = async (username: string): Promise<Diary[]> => {
  try {
    const diary = await diaryModel.getMyDiariesByUsername(username);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '내 다이어리 조회에 실패했습니다.', 500);
  }
};
export const getOneDiary = async (diary_id: number): Promise<Diary | null> => {
  try {
    const diary = await diaryModel.getOneDiaryByUsername(diary_id);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 조회에 실패했습니다.', 500);
  }
};

export const updateDiary = async (
  newDiary: Diary,
  diary_id: number,
  username: string
) => {
    const diary = await diaryModel.getOneDiaryByUsername(diary_id);
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    if (typeof diary.plan_id === 'undefined') {
      throw new AppError(CommonError.INVALID_INPUT, '여행기의 일정 정보가 없습니다.', 400);
    }
    const plan = await diaryModel.getPlan(diary.plan_id,username);
    if (plan?.username !== username) {
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '권한이 없습니다.', 403);
    }
    await diaryModel.updateDiaryByUsername(newDiary, diary_id);
    return diary;
};

export const deleteDiary = async (diary_id: number, username: string) => {
  try {
    const diary = await diaryModel.getOneDiaryByUsername(diary_id);

    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기 찾을 수 없습니다.', 404);
    }
    if (typeof diary.plan_id === 'undefined') {
      throw new AppError(CommonError.INVALID_INPUT, '여행기의 일정 정보가 없습니다.', 400);
    }

    const plan = await diaryModel.getPlan(diary.plan_id,username);
    if (!plan) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '일정을 찾을 수 없습니다.', 404);
    }
    if (plan.username !== username) {
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '권한이 없습니다.', 403);
    }
    await diaryModel.deleteDiaryByUsername(diary_id);
    const deletedDiary = { ...diary };
    return deletedDiary;
  } catch (error) {
    console.error(error);
  }
};

