import { db } from '../loaders/dbLoader';
import { CommentType } from '../types/comment';
import { RowDataPacket, FieldPacket } from 'mysql2';

interface QueryResult extends RowDataPacket {
  comment_id: number;
  user_id: string;
  diary_id: number;
  comment: string;
}

export const createCommentModel = async (comment: CommentType): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO Comment (user_id, diary_id, comment) VALUES (?, ?, ?)', [
      comment.user_id,
      comment.diary_id,
      comment.comment
    ]);
  } finally {
    connection.release(); // 연결 해제
  }
};

export const getCommentsByDiaryModel = async (
  diary_id: number,
  page: number,
  limit: number
): Promise<CommentType[]> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    const offset = (page - 1) * limit;
    const [rows] = (await connection.query('SELECT * FROM comment WHERE diary_id = ? LIMIT ? OFFSET ?', [
      diary_id,
      limit,
      offset,
    ])) as [QueryResult[], FieldPacket[]];

    const comments: CommentType[] = rows.map((row: QueryResult) => ({
      comment_id: row.comment_id,
      user_id: row.user_id,
      diary_id: row.diary_id,
      comment: row.comment,
    }));

    return comments;
  } finally {
    connection.release(); // 연결 해제
  }
};

export const getAllCommentsModel = async (): Promise<CommentType[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM comment');
    return rows as CommentType[];
  } finally {
    connection.release();
  }
};
