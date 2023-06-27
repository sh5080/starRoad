import { FieldPacket, OkPacket, RowDataPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { AppError, CommonError } from '../types/AppError';
import * as User from '../types/user';
import { rowToCamelCase } from '../util/rowToCamelCase';

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
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM user WHERE username = ?', [
      username,
    ]);
    if (rows.length > 0) {
      const userData: User.UserType = rowToCamelCase(rows[0]);
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
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length > 0) {
      const userData: User.UserType = rowToCamelCase(rows[0]);
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
export const deleteUserByUsername = async (username: string): Promise<User.UserType> => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute('SELECT * FROM user WHERE username = ?', [
      username,
    ]);

    if (rows.length === 0) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '존재하지 않는 사용자입니다.', 401);
    }

    const deletedUser: User.UserType = rowToCamelCase(rows[0]);
    await connection.execute<OkPacket>('DELETE FROM user WHERE username = ?', [username]);

    await connection.commit();

    return deletedUser;
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw new AppError(CommonError.UNEXPECTED_ERROR, '회원 탈퇴에 실패했습니다.', 500);
  } finally {
    connection.release();
  }
};
