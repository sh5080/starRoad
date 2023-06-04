import { 
    createDiaryById, 
    getPlanById, 
    getAllDiaryById, 
    getMyDiaryById, 
    getOneDiaryById, 
    updateDiaryById, 
    deleteDiaryById 
} from '../models/diaryModel';
import { DiaryType } from '../types/diary';
import { AppError } from '../api/middlewares/errorHandler';
import { TravelPlan } from '../types/travel';

export const createDiary = async (diary: DiaryType, plan:TravelPlan) => {
    try {
        if (!plan.plan_id) {
            throw new AppError('플랜 ID가 없습니다.', 400);
          }
      const planData = await getPlanById(plan.plan_id, plan.user_id);  
      if (!planData) {
        throw new AppError('플랜을 찾을 수 없습니다.', 404);
      }
      diary.destination = plan.destination; 
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
export const getMyDiary = async (user_id: string): Promise<DiaryType[]> => {
    try {
      const diary = await getMyDiaryById(user_id);
      return diary;
    } catch (error) {
      console.error(error);
      throw new AppError('내 다이어리 조회에 실패했습니다.', 500);
    }
  };
  

export const getOneDiary = async (diary_id: number): Promise<DiaryType | null> => {
  try {
    const diary = await getOneDiaryById(diary_id);
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError('여행기 조회에 실패했습니다.', 500);
  }
};

export const updateDiary = async (newDiary: DiaryType, diary_id: number, user_id: string) => {
  try {
    const diary = await getOneDiaryById(diary_id);
    if (!diary) {
      throw new AppError('여행기를 찾을 수 없습니다.', 404);
    }
    if (diary.user_id !== user_id) {
      throw new AppError('권한이 없습니다.', 403);
    }

    await updateDiaryById(newDiary, diary_id);

    return '여행기 업데이트가 완료되었습니다.';
  } catch (error) {
    console.error(error);
    throw new AppError('여행기 업데이트에 실패했습니다.', 500);
  }
};

export const deleteDiary = async (diary_id: number, user_id: string) => {
    try {
      const diary = await getOneDiaryById(diary_id);
      if (!diary) {
        throw new AppError('여행기를 찾을 수 없습니다.', 404);
      }
      if (diary.user_id !== user_id) {
        throw new AppError('권한이 없습니다.', 403);
      }
  
      await deleteDiaryById(diary_id);
  
      return '여행기 삭제가 완료되었습니다.';
    } catch (error) {
      console.error(error);
      throw new AppError('여행기 삭제에 실패했습니다.', 500);
    }
  };