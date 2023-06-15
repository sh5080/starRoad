import { db } from '../loaders/dbLoader';
import { Comment } from '../types/comment';
import { RowDataPacket } from 'mysql2';
import { AppError, CommonError } from '../types/AppError';

interface QueryResult extends RowDataPacket {
  id: number;
  username: string;
  diaryId: number;
  comment: string;
}

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
 * 특정 다이어리의 댓글 조회
 */
export const getCommentsByDiary = async (
  diaryId: number,
  page: number,
  limit: number
): Promise<Comment[]> => {
  try {
    const offset = Math.floor(page - 1) * limit;

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM comment WHERE diary_id = ? LIMIT ${limit} OFFSET ${offset}`,
      [diaryId, limit, offset]
    );

    const comments: Comment[] = rows.map(
      (row) =>
        ({
          id: row['id'],
          username: row['username'],
          diaryId: row['diary_id'],
          comment: row['comment'],
        } as QueryResult)
    );

    return comments;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 조회에 실패했습니다.', 500);
  }
};

/**
 * 댓글 업데이트
 */
export const updateComment = async (id: number, comment: Comment) => {
  try {
    await db.execute('UPDATE comment SET comment = ? WHERE id = ?', [comment.comment, id]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 업데이트에 실패했습니다.', 500);
  }
};

/**
 * 댓글 조회
 */
export const getComment = async (id: number): Promise<Comment | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM comment WHERE id = ?', [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Comment;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 조회에 실패했습니다.', 500);
  }
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (id: number): Promise<void> => {
  try {
    await db.execute('DELETE FROM comment WHERE id = ?', [id]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 삭제에 실패했습니다.', 500);
  }
};
