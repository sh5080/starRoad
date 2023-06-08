import * as diaryModel from '../models/diaryModel';
import { DiaryType } from '../types/diary';
import { AppError,CommonError } from "../types/AppError";


export const createDiary = async (
  diary: DiaryType, 
  username: string, 
  plan_id: number
  ) => {
    const plan = await diaryModel.getPlan(plan_id, username);
    if (!plan) {
      throw new AppError(CommonError.INVALID_INPUT, '나의 일정만 여행기를 등록할 수 있습니다.', 404);
    }
    const { destination } = plan; // 일정의 destination 값
    diary.destination = destination;
    await diaryModel.createDiaryById(diary);
    return diary
    
};

export const getAllDiaries = async (): Promise<DiaryType[]> => {
  try {
    const diary = await diaryModel.getAllDiariesByUserId();
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '전체 여행기 조회에 실패했습니다.', 500);
  }
};
export const getMyDiaries = async (username: string): Promise<DiaryType[]> => {
  try {
    const diary = await diaryModel.getMyDiariesByUserId(username);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '내 다이어리 조회에 실패했습니다.', 500);
  }
};
export const getOneDiary = async (diary_id: number): Promise<DiaryType | null> => {
  try {
    const diary = await diaryModel.getOneDiaryById(diary_id);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 조회에 실패했습니다.', 500);
  }
};

export const updateDiary = async (
  newDiary: DiaryType,
  diary_id: number,
  username: string
) => {
    const diary = await diaryModel.getOneDiaryById(diary_id);
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    if (diary.username !== username) {
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '권한이 없습니다.', 403);
    }
    await diaryModel.updateDiaryById(newDiary, diary_id);
    return diary;
};

export const deleteDiary = async (diary_id: number, username: string) => {
  try {
    const diary = await diaryModel.getOneDiaryById(diary_id);
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    if (diary.username !== username) {
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '권한이 없습니다.', 403);
    }

    await diaryModel.deleteDiaryById(diary_id);

  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 삭제에 실패했습니다.', 500);
  }
};
