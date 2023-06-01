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

export const getUserById = async (userId: string)=> {
  const pool = await db;
  const connection = await pool.getConnection();
  const [rows] = await connection.execute('SELECT * FROM users WHERE userId = ?', [userId || null]);

  if (Array.isArray(rows) && rows.length > 0) {
    const user = rows[0] as User;
    console.log(user)
    return user;
  }
  // if (Array.isArray(rows) && rows.length > 0) {
  //   console.log(rows[0]);
  //   return rows;
  // }
  
};

