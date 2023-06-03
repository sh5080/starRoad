import { createDiaryById, getAllDiaryById, getOneDiaryById } from '../models/diaryModel';
import { DiaryType } from '../types/diary';
import { AppError } from '../api/middlewares/errorHandler';

export const createDiary = async (diary: DiaryType) => {
try {
        await createDiaryById(diary);
        return '다이어리 생성이 완료되었습니다.';
      } catch (error) {
        console.error(error);
        throw new Error('다이어리 생성에 실패했습니다.');
      }
    };
export const getAllDiary = async (): Promise<DiaryType[]> => {
    try {
      const diary = await getAllDiaryById();
      return diary;
    } catch (error) {
      console.error(error);
      throw new Error('전체 다이어리 조회에 실패했습니다.');
    }
  };
export const getOneDiary = async (diaryId: number): Promise<DiaryType | null> => {
  try {
    const diary = await getOneDiaryById(diaryId);
    return diary;
  } catch (error) {
    console.error(error);
    throw new Error('다이어리 조회에 실패했습니다.');
  }
};