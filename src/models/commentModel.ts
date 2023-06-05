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
    await connection.execute('INSERT INTO comment (user_id, diary_id, comment) VALUES (?, ?, ?)', [
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

export const updateCommentModel = async (comment_id: number, comment: CommentType): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE comment SET comment = ? WHERE comment_id = ?', 
    [comment.comment, comment_id]);
  } finally {
    connection.release();
  }
};
export const getCommentModel = async (comment_id: number): Promise<CommentType | null> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM comment WHERE comment_id = ?', [comment_id]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as CommentType;
    }
    return null;
  } finally {
    connection.release();
  }
};
export const deleteCommentModel = async (comment_id: number): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM comment WHERE comment_id = ?', [comment_id]);
  } finally {
    connection.release();
  }
};

