import { db } from '../loaders/dbLoader';
import { User } from '../types/user';

export const createUser = async (user: User) => {
  const pool = db;
	// console.log("여기1")
  const connection = await pool.getConnection();
	// console.log("여기2")

  await connection.execute('INSERT INTO users (name, userid, password, email) VALUES (?, ?, ?, ?)', [
    user.name,
    user.userid,
    user.password,
    user.email,
  ]);

};

export const getUserById = async (userid: string) => {
  const pool = await db;
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM users WHERE userid = ?', [userid]);
  if (Array.isArray(rows) && rows.length > 0) {
    const userData = rows[1] as User;
    return userData;
  }
  return null;
};


