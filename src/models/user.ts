import { db } from '../loaders/dbLoader';
import { User } from '../types/user';

export const createUser = async (user: User) => {
  const pool = db;
	// console.log("여기1")
  const connection = await pool.getConnection();
	// console.log("여기2")

  await connection.execute('INSERT INTO users (name, userId, password, email) VALUES (?, ?, ?, ?)', [
    user.name,
    user.userId,
    user.password,
    user.email,
  ]);

};

export const getUserById = async (userId: string) => {
  const pool = await db;
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM users WHERE userId = ?', [userId]);
  if (Array.isArray(rows) && rows.length > 0) {
    const userData = rows[0] as User;
    console.log(rows[0])
    return userData;
  }
  return null;
};

