import { db } from '../loaders/dbLoader';
import { DiaryType } from '../types/diary';
import { TravelPlan } from '../types/travel';

export const createDiaryById = async (diary: DiaryType): Promise<void> => {
  try {
    await db.execute(
      'INSERT INTO travel_diary (user_id, plan_id, title, content, image, destination) VALUES (?, ?, ?, ?, ?, ?)',
      [diary.user_id, diary.plan_id, diary.title, diary.content, diary.image, diary.destination]
    );
  } catch (error) {
    console.error(error);
    throw new Error('여행기 생성에 실패했습니다.');
  }
};

export const getPlan = async (plan_id: number, user_id: string): Promise<TravelPlan | null> => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM travel_plan WHERE plan_id = ? AND user_id = ?',
      [plan_id, user_id]
    );
    if (Array.isArray(rows) && rows.length > 0) {
      const plan = rows[0] as TravelPlan;
      return plan;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('여행 계획을 가져오는 중에 오류가 발생했습니다.');
  }
};

export const getAllDiaryById = async (): Promise<DiaryType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_diary');
    const diary = rows as DiaryType[];
    return diary;
  } catch (error) {
    console.error(error);
    throw new Error('모든 여행기를 가져오는 중에 오류가 발생했습니다.');
  }
};

export const getMyDiaryById = async (user_id: string): Promise<DiaryType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_diary WHERE user_id = ?', [user_id]);
    return rows as DiaryType[];
  } catch (error) {
    console.error(error);
    throw new Error('내 여행기를 가져오는 중에 오류가 발생했습니다.');
  }
};

export const getOneDiaryById = async (diary_id: number): Promise<DiaryType | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_diary WHERE diary_id = ?', [diary_id]);
    if (Array.isArray(rows) && rows.length > 0) {
      const diary = rows[0] as DiaryType;
      return diary;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('여행기를 가져오는 중에 오류가 발생했습니다.');
  }
};

export const updateDiaryById = async (diary: DiaryType, diary_id: number): Promise<void> => {
  try {
    await db.execute(
      'UPDATE travel_diary SET title = ?, content = ?, image = ? WHERE diary_id = ?',
      [diary.title, diary.content, diary.image, diary_id]
    );
  } catch (error) {
    console.error(error);
    throw new Error('여행기 업데이트에 실패했습니다.');
  }
};

export const deleteDiaryById = async (diary_id: number): Promise<void> => {
  try {
    await db.execute('DELETE FROM travel_diary WHERE diary_id = ?', [diary_id]);
  } catch (error) {
    console.error(error);
    throw new Error('여행기 삭제에 실패했습니다.');
  }
};
