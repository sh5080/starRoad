import { db } from '../loaders/dbLoader';
import { CommentType } from '../types/comment';

export const createCommentModel = async (comment: CommentType): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO Comment (userId, diaryId, comment) VALUES (?, ?, ?)', [
      comment.userId,
      comment.diaryId,
      comment.comment
    ]);
  } finally {
    connection.release(); // 연결 해제
  }
};