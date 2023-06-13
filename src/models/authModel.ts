import { ResultSetHeader } from 'mysql2/promise';
import { db } from '../loaders/dbLoader';
import { AppError, CommonError } from '../types/AppError';
import * as User from '../types/user';

// export const saveOauthUser = async (OauthUser: User.OauthUser):Promise<User.OauthUser> => {
//     try{ const { username, email, oauthProvider } = OauthUser;
//      const query = 'INSERT INTO user (username, email, oauth_provider) VALUES (?, ?, ?)';
//    await db.execute(query, [username, email, oauthProvider]);

//      return OauthUser
//    }catch(error){
//      console.error(error)
//      throw new AppError(CommonError.UNEXPECTED_ERROR,'간편 로그인 실패',500)
//    }
//    };

export const saveOauthUser = async (user: User.OauthUser): Promise<User.OauthUser> => {
  const query = 'INSERT INTO user (username, email, oauth_provider) VALUES (?, ?, ?)';
  const values = [user.username, user.email, user.oauthProvider];

  const [result] = await db.query<ResultSetHeader>(query, values);
  const insertId = result.insertId;

  const createdUser: User.OauthUser = {
    ...user,
    id: insertId,
  };

  return createdUser;
};

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

export const getUserByEmail = async (email?: string): Promise<User.OauthUser | null> => {
  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      const userData = rows[0] as User.OauthUser;
      if (userData.oauthProvider === undefined) {
        const query = `UPDATE user SET oauth_provider = ? WHERE email = ?`;
        const oauthProvider = 'google';
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
