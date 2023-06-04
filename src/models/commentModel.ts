import { OkPacket } from 'mysql2';
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

export const getCommentsByDiaryModel = async (diaryId: number, page: number, limit: number): Promise<CommentType[]> => {
    const pool = db;
    const connection = await pool.getConnection();
    try {
      const offset = (page - 1) * limit; // 오프셋 계산
//       console.log('limit:', limit);
// console.log('offset:', offset);
      const [rows] = await connection.execute<OkPacket>('SELECT * FROM Comment WHERE diaryId = ? LIMIT ? OFFSET ?', [diaryId, limit, offset]); // LIMIT과 OFFSET 적용
        console.log([rows])
      if (!Array.isArray(rows)) {
        throw new Error('댓글 조회에 실패했습니다.');
      }
  
      const comments: CommentType[] = rows.map((row) => ({
        commentId: row.commentId,
        userId: row.userId,
        diaryId: row.diaryId,
        comment: row.comment
      }));
      return comments;
    } finally {
      connection.release(); // 연결 해제
    }
  };
  