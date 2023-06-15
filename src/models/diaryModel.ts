import { db } from '../loaders/dbLoader';
import { Diary } from '../types/diary';
import { TravelPlan } from '../types/travel';
import { AppError, CommonError } from '../types/AppError';
import { toCamelCase } from '../util/toCamelCase';

/**
 * 여행기 생성
 */
export const createDiary = async (diary: Diary, plan: Diary): Promise<void> => {
  try {
    await db.execute('INSERT INTO travel_diary (plan_id, title, content, image, destination) VALUES (?, ?, ?, ?, ?)', [
      plan.planId,
      diary.title,
      diary.content,
      JSON.stringify(diary.image),
      diary.destination,
    ]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 생성에 실패했습니다.', 500);
  }
};

/**
 * 특정 여행 일정 조회
 */
export const getPlan = async (planId: number, username: string): Promise<TravelPlan | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_plan WHERE plan_id = ? AND username = ?', [planId, username]);

    if (Array.isArray(rows) && rows.length > 0) {
      const rawPlan = rows[0];
      const plan: any = {};

      if (typeof rawPlan === 'object' && rawPlan !== null && 'plan_id' in rawPlan && 'username' in rawPlan) {
        for (const key in rawPlan) {
          if (rawPlan.hasOwnProperty(key)) {
            plan[toCamelCase(key)] = rawPlan[key];
          }
        }
      }

      return plan as TravelPlan;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 일정을 가져오는 중에 오류가 발생했습니다.', 404);
  }
};

/**
 * 모든 여행기 조회
 */
export const getAllDiariesByUsername = async (): Promise<Diary[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_diary');
    const diary = rows as Diary[];
    return diary;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '모든 여행기를 가져오는 중에 오류가 발생했습니다.', 404);
  }
};

/**
 * 내 여행기 조회
 */
export const getMyDiariesByUsername = async (username: string): Promise<Diary[]> => {
  try {
    const query = `
      SELECT td.*
      FROM travel_diary td
      JOIN travel_plan p ON td.plan_id = p.plan_id
      WHERE p.username = ?;
    `;
    const [rows] = await db.execute(query, [username]);
    return rows as Diary[];
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '내 여행기를 가져오는 중에 오류가 발생했습니다.', 404);
  }
};

/**
 * 특정 여행기 조회
 */
export const getOneDiaryByDiaryId = async (diaryId: number): Promise<Diary | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_diary WHERE id = ?', [diaryId]);
    if (Array.isArray(rows) && rows.length > 0) {
      const diary = rows[0] as Diary;
      return diary;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기를 가져오는 중에 오류가 발생했습니다.', 404);
  }
};

/**
 * 여행기 수정
 */
export const updateDiaryByUsername = async (diary: Omit<Diary, 'id'>, diary_id: number): Promise<void> => {
  try {
    await db.execute('UPDATE travel_diary SET title = ?, content = ?, image = ? WHERE id = ?', [
      diary.title,
      diary.content,
      diary.image,
      diary_id,
    ]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 업데이트에 실패했습니다.', 500);
  }
};

/**
 * 여행기 삭제
 */
export const deleteDiaryByUsername = async (diaryId: number): Promise<void> => {
  try {
    await db.execute('DELETE FROM travel_diary WHERE id = ?', [diaryId]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 삭제에 실패했습니다.', 500);
  }
};
