import { createDiaryById } from '../models/diaryModel';
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