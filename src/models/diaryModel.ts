import { db } from '../loaders/dbLoader';
import { DiaryType } from '../types/diary';
import { TravelPlan } from '../types/travel';
export const createDiaryById = async (diary: DiaryType): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO travel_diary (user_id, plan_id, title, content, image, destination) VALUES (?, ?, ?, ?, ?, ?)',
      [diary.userId, diary.planId, diary.title, diary.content, diary.image, diary.destination]
    );
  } finally {
    connection.release(); // 연결 해제
  }
};
export const getPlanById = async (planId: number, userId: string): Promise<TravelPlan | null> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM travel_plan WHERE plan_id = ? AND user_id = ?', [
      planId,
      userId,
    ]);
    if (Array.isArray(rows) && rows.length > 0) {
      const plan = rows[0] as TravelPlan;
      return plan;
    }
    return null;
  } finally {
    connection.release();
  }
};
export const getAllDiaryById = async (): Promise<DiaryType[]> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM travel_diary');
    const diary = rows as DiaryType[];
    return diary;
  } finally {
    connection.release();
  }
};
export const getMyDiaryById = async (userId: string): Promise<DiaryType[]> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM travel_diary WHERE user_id = ?', [userId]);
    return rows as DiaryType[];
  } finally {
    connection.release();
  }
};
export const getOneDiaryById = async (diaryId: number): Promise<DiaryType | null> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM travel_diary WHERE diary_id = ?', [diaryId]);
    if (Array.isArray(rows) && rows.length > 0) {
      const diary = rows[0] as DiaryType;
      return diary;
    }
    return null;
  } finally {
    connection.release();
  }
};
export const updateDiaryById = async (diary: DiaryType, diaryId: number): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('UPDATE travel_diary SET title = ?, content = ?, image = ? WHERE diary_id = ?', [
      diary.title,
      diary.content,
      diary.image,
      diaryId,
    ]);
  } finally {
    connection.release();
  }
};

export const deleteDiaryById = async (diaryId: number): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM travel_diary WHERE diary_id = ?', [diaryId]);
  } finally {
    connection.release();
  }
};
