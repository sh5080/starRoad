import { OkPacket, RowDataPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { AppError, CommonError } from '../types/AppError';
import * as User from '../types/user';

/**
 * 사용자 생성
 */
export const createUser = async (user: User.UserType): Promise<void> => {
  try {
    await db.execute('INSERT INTO user (name, username, password, email) VALUES (?, ?, ?, ?)', [
      user.name,
      user.username,
      user.password,
      user.email,
    ]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '회원가입에 실패했습니다.', 500);
  }
};

/**
 * 사용자 아이디로 사용자 정보 조회
 */
export const getUserByUsername = async (username?: string): Promise<User.UserType | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
    if (Array.isArray(rows) && rows.length > 0) {
      const userData = rows[0] as User.UserType;
      return userData;
    }
    return null;
  } catch (error) {
    console.error(error);
    {
      throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 조회에 실패했습니다.', 500);
    }
  }
};

/**
 * 이메일로 사용자 정보 조회
 */
export const getUserByEmail = async (email?: string): Promise<User.UserType | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      const userData = rows[0] as User.UserType;
      return userData;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 조회에 실패했습니다.', 500);
  }
};

/**
 * 사용자 정보 수정
 */
export const updateUserByUsername = async (
  userId: string,
  updateData: Partial<Pick<User.UserType, 'email' | 'password'>>
): Promise<User.UserType | null> => {
  try {
    const { email, password } = updateData;

    await db.execute('UPDATE user SET email = ?, password = ? WHERE username = ?', [email, password, userId]);

    const updatedUser = await getUserByUsername(userId);
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 수정에 실패했습니다.', 500);
  }
};

/**
 * 사용자 삭제
 */
export const deleteUserByUsername = async (username: string): Promise<User.UserType | null> => {
  try {
    const [result] = await db.execute<RowDataPacket[]>('SELECT * FROM user WHERE username = ?', [username]);

    if (result.length === 0) {
      return null; // 사용자가 존재하지 않음
    }

    const [deletedUser] = result;
    await db.execute<OkPacket>('DELETE FROM user WHERE username = ?', [username]);

    return deletedUser as User.UserType;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '회원 탈퇴에 실패했습니다.', 500);
  }
};
