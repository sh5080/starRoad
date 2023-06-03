import { createDiaryById, getAllDiaryById, getMyDiaryById, getOneDiaryById, updateDiaryById, deleteDiaryById } from '../models/diaryModel';
import { DiaryType } from '../types/diary';
import { AppError } from '../api/middlewares/errorHandler';

export const createDiary = async (diary: DiaryType) => {
  try {
    await createDiaryById(diary);
    return '여행기 생성이 완료되었습니다.';
  } catch (error) {
    console.error(error);
    throw new AppError('여행기 생성에 실패했습니다.', 500);
  }
};

export const getAllDiary = async (): Promise<DiaryType[]> => {
  try {
    const diary = await getAllDiaryById();
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError('전체 여행기 조회에 실패했습니다.', 500);
  }
};
export const getMyDiary = async (userId: string): Promise<DiaryType[]> => {
    try {
      const diary = await getMyDiaryById(userId);
      return diary;
    } catch (error) {
      console.error(error);
      throw new AppError('내 다이어리 조회에 실패했습니다.', 500);
    }
  };
  

export const getOneDiary = async (diaryId: number): Promise<DiaryType | null> => {
  try {
    const diary = await getOneDiaryById(diaryId);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError('여행기 조회에 실패했습니다.', 500);
  }
};

export const updateDiary = async (newDiary: DiaryType, diaryId: number, userId: string) => {
  try {
    const diary = await getOneDiaryById(diaryId);
    if (!diary) {
      throw new AppError('여행기를 찾을 수 없습니다.', 404);
    }
    if (diary.userId !== userId) {
      throw new AppError('권한이 없습니다.', 403);
    }

    await updateDiaryById(newDiary, diaryId);

    return '여행기 업데이트가 완료되었습니다.';
  } catch (error) {
    console.error(error);
    throw new AppError('여행기 업데이트에 실패했습니다.', 500);
  }
};

export const deleteDiary = async (diaryId: number, userId: string) => {
    try {
      const diary = await getOneDiaryById(diaryId);
      if (!diary) {
        throw new AppError('여행기를 찾을 수 없습니다.', 404);
      }
      if (diary.userId !== userId) {
        throw new AppError('권한이 없습니다.', 403);
      }
  
      await deleteDiaryById(diaryId);
  
      return '여행기 삭제가 완료되었습니다.';
    } catch (error) {
      console.error(error);
      throw new AppError('여행기 삭제에 실패했습니다.', 500);
    }
  };