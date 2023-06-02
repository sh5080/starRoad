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
