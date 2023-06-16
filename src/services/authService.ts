import qs from 'qs';
import * as authModel from '../models/authModel';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as User from '../types/user';
import { AppError, CommonError } from '../types/AppError';

const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

/**
 * OAuth 사용자 회원가입
 */
export const OauthSignupUser = async (user: User.OauthUser) => {
  try {
    // 이메일과 이름을 기반으로 사용자를 생성하고, 필요한 추가 정보를 설정합니다.
    const newUser: User.OauthUser = {
      username: await generateUsername(user.username),
      email: user.email,
      oauthProvider: user.oauthProvider,
    };

    // 생성된 사용자를 저장하고 반환
    const createdUser = await authModel.saveOauthUser(newUser);

    return createdUser;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '간편 로그인 실패', 500);
  }
};

/**
 * 사용자 이름에 랜덤한 접미사를 추가하여 유저네임을 생성
 */
const generateUsername = async (username: string): Promise<string> => {
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${username.replace(' ', '')}_${randomSuffix}`;
};

/**
 * OAuth 사용자 로그인
 */
export const OauthLoginUser = async (username: string): Promise<object> => {
  const user = await authModel.getUserByUsername(username);

  if (!user) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '없는 사용자입니다.', 404);
  }

  if (!user.activated) {
    throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '탈퇴한 회원입니다.', 400);
  }

  const accessToken: string = jwt.sign({ username: user.username, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken: string = jwt.sign({ username: user.username, role: user.role }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

/**
 * 이메일로 OAuth 사용자 정보 조회
 */
export const getUserForOauth = async (email: string) => {
  const user = await authModel.getUserByEmail(email);
  return user;
};

/**
 * OAuth 로그인 URL 생성
 */
export const generateLoginUrl = (oauthProvider: string): string => {
  const clientId = process.env[`${oauthProvider.toUpperCase()}_CLIENT_ID`] as string;
  const redirectUri = process.env[`${oauthProvider.toUpperCase()}_REDIRECT_URI`] as string;
  let params: Record<string, string> = {};

  if (oauthProvider === 'kakao') {
    const responseType = 'code';
    params = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
    };
  } else if (oauthProvider === 'google') {
    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    const responseType = 'code';
    params = {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      response_type: responseType,
    };
  } else {
    throw new Error(`Unsupported OAuth provider: ${oauthProvider}`);
  }

  const queryString = qs.stringify(params);
  return `https://${oauthProvider === 'kakao' ? 'kauth.kakao.com' : 'accounts.google.com'}/oauth/authorize?${queryString}`;
};
