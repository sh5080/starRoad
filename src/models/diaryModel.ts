import { db } from '../loaders/dbLoader';
import { DiaryType } from '../types/diary';
import { TravelPlan } from '../types/travel';
export const createDiaryById = async (diary: DiaryType): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO TravelDiary (userId, planId, title, content, image, destination) VALUES (?, ?, ?, ?, ?, ?)', [
      diary.userId,
      diary.planId,
      diary.title,
      diary.content,
      diary.image,
      diary.destination
    ]);
  } finally {
    connection.release(); // 연결 해제
  }
};
export const getPlanById = async (planId: number, userId: string): Promise<TravelPlan | null> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM TravelPlan WHERE planId = ? AND userId = ?', [planId, userId]);
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
    const [rows] = await connection.execute('SELECT * FROM TravelDiary');
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
    const [rows] = await connection.execute('SELECT * FROM TravelDiary WHERE userId = ?', [userId]);
    return rows as DiaryType[];
  } finally {
    connection.release();
  }
};
export const getOneDiaryById = async (diaryId: number): Promise<DiaryType | null> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM TravelDiary WHERE diaryId = ?', [diaryId]);
    if (Array.isArray(rows) && rows.length > 0) {
      const diary = rows[0] as DiaryType;
      return diary;
    }
    return null;
  } finally {
    connection.release();
  }
};
export const updateDiaryById = async (diary: DiaryType, diaryId: number): Promise<void>=> {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('UPDATE TravelDiary SET title = ?, content = ?, image = ? WHERE diaryId = ?', [
      diary.title,
      diary.content,
      diary.image,
      diaryId
    ]);
  } finally {
    connection.release();
  }
};

export const deleteDiaryById = async (diaryId: number): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM TravelDiary WHERE diaryId = ?', [diaryId]);
  } finally {
    connection.release();
  }
};