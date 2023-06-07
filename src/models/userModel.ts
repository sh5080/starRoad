import { OkPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { UserType } from '../types/user';

export const createUser = async (user: UserType): Promise<void> => {
  await db.execute('INSERT INTO user (name, username, password, email) VALUES (?, ?, ?, ?)', [
    user.name,
    user.username,
    user.password,
    user.email,
  ]);
};

export const getUserById = async (username: string): Promise<UserType | null> => {
  const [rows] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
  if (Array.isArray(rows) && rows.length > 0) {
    const userData = rows[0] as UserType;
    return userData;
  }
  return null;
};

export const updateUserById = async (
  username: string,
  updateData: Partial<Pick<UserType, 'email' | 'password'>>
): Promise<UserType | null> => {
  await db.execute('UPDATE user SET ? WHERE username = ?', [updateData, username]);

  return null;
};

export const deleteUserById = async (username: string): Promise<boolean> => {
  const [result] = await db.execute<OkPacket>('UPDATE user SET activated = 0 WHERE username = ?', [username]);

  if (result.affectedRows > 0) {
    return true; // 삭제 성공
  }

  return false; // 삭제 실패
};

