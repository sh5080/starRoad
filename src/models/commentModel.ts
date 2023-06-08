import { db } from '../loaders/dbLoader';
import { CommentType } from '../types/comment';
import { RowDataPacket, FieldPacket } from 'mysql2';

interface QueryResult extends RowDataPacket {
  id: number;
  username: string;
  diary_id: number;
  comment: string;
}

export const createCommentModel = async (comment: CommentType): Promise<void> => {
  try {
    await db.execute('INSERT INTO comment (username, diary_id, comment) VALUES (?, ?, ?)', [
      comment.username,
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
    const offset = Math.floor(page - 1) * limit;

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM comment WHERE diary_id = ? LIMIT ${limit} OFFSET ${offset}`,
      [diary_id, limit, offset]
    );

    const comments: CommentType[] = rows.map(
      (row) =>
        ({
          id: row['id'],
          username: row['username'],
          diary_id: row['diary_id'],
          comment: row['comment'],
        } as QueryResult)
    );

    return comments;
  } catch (error) {
    console.error(error);
    throw new Error('댓글 조회에 실패했습니다.');
  }
};

export const getAllCommentsModel = async (): Promise<CommentType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM comment');
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
