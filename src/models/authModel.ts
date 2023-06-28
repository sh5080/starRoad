import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { db } from '../loaders/dbLoader';
import { AppError, CommonError } from '../types/AppError';
import * as User from '../types/user';
import { rowToCamelCase } from '../util/rowToCamelCase';

/** OAuth 사용자 저장 */
export const saveOauthUser = async (user: User.OauthUser): Promise<User.OauthUser> => {
  const query = 'INSERT INTO user (username, name, email, oauth_provider, password) VALUES (?, ?, ?, ?, ?)';
  const values = [user.username, user.username, user.email, user.oauthProvider, null];

  const [result] = await db.execute<ResultSetHeader>(query, values);

  const createdUser: User.OauthUser = {
    ...user,
    id: result.insertId,
    name: user.username,
  };

  return createdUser;
};

/** 아이디로 사용자 조회 */
export const getUserByUsername = async (username?: string): Promise<User.UserType | null> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM user WHERE username = ?', [
      username,
    ]);
    if (rows.length > 0) {
      const userData: User.OauthUser = rowToCamelCase(rows[0]);
      return userData;
    }
    return null;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 조회에 실패했습니다.', 500);
    }
  }
};

/** 이메일로 사용자 조회 */
export const getUserByEmail = async (email?: string): Promise<User.OauthUser | null> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute('SELECT * FROM user WHERE email = ?', [
      email,
    ]);
    if (rows.length > 0) {
      const userData: User.OauthUser = rowToCamelCase(rows[0]);

      if (userData.oauthProvider === undefined) {
        const query = `UPDATE user SET oauth_provider = ? WHERE email = ?`;
        const oauthProvider = 'KAKAO' || 'GOOGLE';
        await connection.query(query, [oauthProvider, email]);
        userData.oauthProvider = oauthProvider;
      }

      await connection.commit();
      return userData;
    }
    await connection.commit();
    return null;
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보조회에 실패했습니다.', 500);
    }
  } finally {
    connection.release();
  }
};
