import { OkPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { UserType } from '../types/user';
import { RowDataPacket } from 'mysql2';

export const createUser = async (user: UserType): Promise<void> => {
  await db.execute('INSERT INTO user (name, username, password, email) VALUES (?, ?, ?, ?)', [
    user.name,
    user.username,
    user.password,
    user.email,
  ]);
};

export const getUserByUsername = async (username: string): Promise<UserType | null> => {
  const [rows] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
  if (Array.isArray(rows) && rows.length > 0) {
    const userData = rows[0] as UserType;
    return userData;
  }
  return null;
};

export const updateUserByUsername = async (
  userId: string,
  updateData: Partial<Pick<UserType, 'email' | 'password'>>
): Promise<UserType | null> => {
  const { email, password } = updateData;

await db.execute(
    'UPDATE user SET email = ?, password = ? WHERE username = ?',
    [email, password, userId]
  );


  const updatedUser = await getUserByUsername(userId);
  return updatedUser;
};

export const deleteUserByUsername = async (username: string): Promise<UserType | null> => {
  const [result] = await db.execute<RowDataPacket[]>('SELECT * FROM user WHERE username = ?', [username]);
  
  if (result.length === 0) {
    return null; // 사용자가 존재하지 않음
  }

  const [deletedUser] = result;
  await db.execute<OkPacket>('DELETE FROM user WHERE username = ?', [username]);

  return deletedUser as UserType;
};
