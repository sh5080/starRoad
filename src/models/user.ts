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
