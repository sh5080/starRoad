import { OkPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { UserType } from '../types/user';

export const createUser = async (user: UserType): Promise<void> => {
  await db.execute('INSERT INTO user (name, user_id, password, email) VALUES (?, ?, ?, ?)', [
    user.name,
    user.user_id,
    user.password,
    user.email,
  ]);
};

export const getUserById = async (user_id: string): Promise<UserType | null> => {
  const [rows] = await db.execute('SELECT * FROM user WHERE user_id = ?', [user_id]);
  if (Array.isArray(rows) && rows.length > 0) {
    const userData = rows[0] as UserType;
    return userData;
  }
  return null;
};

export const updateUserById = async (
  user_id: string,
  updateData: Partial<Pick<UserType, 'email' | 'password'>>
): Promise<UserType | null> => {
  const [result] = await db.query<OkPacket>('UPDATE user SET ? WHERE user_id = ?', [updateData, user_id]);

  if (!result.affectedRows) {
    return null;
  }

  const [updatedUserRows] = await db.execute('SELECT * FROM user WHERE user_id = ?', [user_id]);
  if (Array.isArray(updatedUserRows) && updatedUserRows.length > 0) {
    const updatedUser = updatedUserRows[0] as UserType;
    return updatedUser;
  }

  return null;
};

export const deleteUserById = async (user_id: string): Promise<boolean> => {
  const [result] = await db.query<OkPacket>('UPDATE user SET activated = 0 WHERE user_id = ?', [user_id]);

  if (result.affectedRows > 0) {
    return true; // 삭제 성공
  }

  return false; // 삭제 실패
};
