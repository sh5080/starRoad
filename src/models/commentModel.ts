import { db } from '../loaders/dbLoader';
import { Comment } from '../types/comment';
import { RowDataPacket, FieldPacket } from 'mysql2/promise';
import { AppError, CommonError } from '../types/AppError';
import { rowToCamelCase } from '../util/rowToCamelCase';

/**
 * 댓글 생성
 */
export const createComment = async (comment: Comment): Promise<void> => {
  try {
    await db.execute('INSERT INTO comment (username, diary_id, comment) VALUES (?, ?, ?)', [
      comment.username,
      comment.diaryId,
      comment.comment,
    ]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 생성에 실패했습니다.', 500);
  }
};

/**
 * 특정 여행기의 댓글 조회
 */
export const getCommentsByDiaryId = async (diaryId: number, page: number, limit: number): Promise<Comment[]> => {
  try {
    const offset = Math.floor(page - 1) * limit;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `SELECT * FROM comment WHERE diary_id = ? LIMIT = ? OFFSET = ?`,
      [diaryId, limit, offset]
    );

    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 조회에 실패했습니다.', 500);
  }
};

export const updateComment = async (newComment: Comment, id: number) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT username FROM comment WHERE id = ?',
      [id]
    );
    const commentsInfo = rows[0];

    await connection.execute('UPDATE comment SET comment = ? WHERE id = ?', [newComment.comment, id]);

    await connection.commit();
    return commentsInfo;
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 업데이트에 실패했습니다.', 500);
  } finally {
    connection.release();
  }
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (id: number) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT username FROM comment WHERE id = ?',
      [id]
    );
    const commentsInfo = rows[0];
    await connection.execute('DELETE FROM comment WHERE id = ?', [id]);
    await connection.commit();
    return commentsInfo;
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 삭제에 실패했습니다.', 500);
  } finally {
    connection.release();
  }
};
