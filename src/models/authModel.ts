import { ResultSetHeader } from 'mysql2/promise';
import { db } from '../loaders/dbLoader';
import { AppError, CommonError } from '../types/AppError';
import * as User from '../types/user';

/** OAuth 사용자 저장 */
export const saveOauthUser = async (user: User.OauthUser): Promise<User.OauthUser> => {
  const query = 'INSERT INTO user (username, name, email, oauth_provider, password) VALUES (?, ?, ?, ?, ?)';
  const values = [user.username, user.username, user.email, user.oauthProvider, null];

  const [result] = await db.execute<ResultSetHeader>(query, values);
  const insertId = result.insertId;

  const createdUser: User.OauthUser = {
    ...user,
    id: insertId,
    name: user.username
  };

  return createdUser;
};

/** 아이디로 사용자 조회 */
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
    throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 조회에 실패했습니다.', 500);
  }
};

/** 이메일로 사용자 조회 */
export const getUserByEmail = async (email?: string): Promise<User.OauthUser | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      const userData = rows[0] as User.OauthUser;

      if (userData.oauthProvider === undefined) {
        const query = `UPDATE user SET oauth_provider = ? WHERE email = ?`;
        const oauthProvider = 'kakao' || 'google';
        await db.query(query, [oauthProvider, email]);
        userData.oauthProvider = oauthProvider;
      }

      return userData;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 조회에 실패했습니다.', 500);
  }
};
