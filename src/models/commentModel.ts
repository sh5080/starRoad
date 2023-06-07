import { db } from '../loaders/dbLoader';
import { CommentType } from '../types/comment';
import { RowDataPacket, FieldPacket } from 'mysql2';

interface QueryResult extends RowDataPacket {
  id: number;
  user_id: string;
  diary_id: number;
  comment: string;
}

export const createCommentModel = async (comment: CommentType): Promise<void> => {
  try {
    await db.execute('INSERT INTO comment (user_id, diary_id, comment) VALUES (?, ?, ?)', [
      comment.user_id,
      comment.diary_id,
      comment.comment,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('댓글 생성에 실패했습니다.');
  }
};

export const getCommentsByDiaryModel = async (
  diary_id: number,
  page: number,
  limit: number
): Promise<CommentType[]> => {
  try {
    const offset = (page - 1) * limit;
    const [rows] = (await db.query('SELECT * FROM comment WHERE diary_id = ? LIMIT ? OFFSET ?', [
      diary_id,
      limit,
      offset,
    ])) as [QueryResult[], FieldPacket[]];

    const comments: CommentType[] = rows.map((row: QueryResult) => ({
      id: row.id,
      user_id: row.user_id,
      diary_id: row.diary_id,
      comment: row.comment,
    }));

    return comments;
  } catch (error) {
    console.error(error);
    throw new Error('댓글 조회에 실패했습니다.');
  }
};

export const getAllCommentsModel = async (): Promise<CommentType[]> => {
  try {
    const [rows] = await db.query('SELECT * FROM comment');
    return rows as CommentType[];
  } catch (error) {
    console.error(error);
    throw new Error('모든 댓글 조회에 실패했습니다.');
  }
};

export const updateCommentModel = async (id: number, comment: CommentType): Promise<void> => {
  try {
    await db.execute('UPDATE comment SET comment = ? WHERE id = ?', [comment.comment, id]);
  } catch (error) {
    console.error(error);
    throw new Error('댓글 업데이트에 실패했습니다.');
  }
};

export const getCommentModel = async (id: number): Promise<CommentType | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM comment WHERE id = ?', [id]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as CommentType;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('댓글 조회에 실패했습니다.');
  }
};

export const deleteCommentModel = async (id: number): Promise<void> => {
  try {
    await db.execute('DELETE FROM comment WHERE id = ?', [id]);
  } catch (error) {
    console.error(error);
    throw new Error('댓글 삭제에 실패했습니다.');
  }
};
