import { db } from '../loaders/dbLoader';
import { User } from '../types/user';

export const createUser = async (user: User) => {
  const pool = await db;
  const connection = await pool.getConnection();
  await connection.execute('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [
    user.name,
    user.email,
    user.password,
  ]);
};

export const getUserByEmail = async (email: string) => {
  const pool = await db;
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]);
  if (Array.isArray(rows) && rows.length > 0) {
    const userData = rows[0] as User;
    return userData;
  }
  return null;
};


