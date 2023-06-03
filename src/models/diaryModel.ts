import { db } from '../loaders/dbLoader';
import { DiaryType } from '../types/diary';

export const createDiaryById = async (diary: DiaryType): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO TravelDiary (userId, title, content, image) VALUES (?, ?, ?, ?)', [
      diary.userId,
      diary.title,
      diary.content,
      diary.image,
      //추후 여행일정 필요한 경우 planId 추가
    ]);
  } finally {
    connection.release(); // 연결 해제
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