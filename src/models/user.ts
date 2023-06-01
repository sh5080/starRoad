import { db } from '../loaders/dbLoader';
import { UserType } from '../types/user';

export const createUser = async (user: UserType): Promise<void> => {
  const pool = db;
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO users (name, userId, password, email) VALUES (?, ?, ?, ?)', [
      user.name,
      user.userId,
      user.password,
      user.email,
    ]);
  } finally {
    connection.release(); // 연결 해제
  }
};

export const getUserById = async (userId: string): Promise<UserType | null> => {
  const pool = await db;
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE userId = ?', [userId]);
    if (Array.isArray(rows) && rows.length > 0) {
      const userData = rows[0] as UserType;
      return userData;
    }
    return null;
  } finally {
    connection.release(); // 연결 해제
  }
};
