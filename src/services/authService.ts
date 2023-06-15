import axios from 'axios';
import qs from 'qs';
import bcrypt from 'bcrypt';
import * as authModel from '../models/authModel';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as User from '../types/user';
import { AppError, CommonError } from '../types/AppError';
const { saltRounds } = config.bcrypt;
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

export const OauthSignupUser = async (user: User.OauthUser) => {
    try {
      // 이메일과 이름을 기반으로 사용자를 생성하고, 필요한 추가 정보를 설정합니다.
      const newUser:User.OauthUser = {
        username: await generateUsername(user.username),
        email: user.email,
        oauthProvider: user.oauthProvider
      };
   
  
      // 생성된 사용자를 저장하고 반환합니다.
      const createdUser = await authModel.saveOauthUser(newUser);
  
      return createdUser;
    } catch (error) {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '간편 로그인 실패', 500);
    }
  };
  
  const generateUsername = async (username: string): Promise<string> => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${username.replace(' ', '')}_${randomSuffix}`;
  };
  
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
  
  export const getUserForOauth = async (email: string) => {
    const user = await authModel.getUserByEmail(email);
  
    return user;
  };

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
  

  // export const generateLoginUrlForKakao = (): string => {
  //   const clientId = process.env.KAKAO_CLIENT_ID as string;
  //   const redirectUri = process.env.KAKAO_REDIRECT_URI as string;
  //   const responseType = 'code';
  
  //   const params = {
  //     client_id: clientId,
  //     redirect_uri: redirectUri,
  //     response_type: responseType,
  //   };
  
  //   const queryString = qs.stringify(params);
  //   return `https://kauth.kakao.com/oauth/authorize?${queryString}`;
  // };

  
  // export const generateLoginUrlForGoogle = (): string => {
  //   const clientId = process.env.GOOGLE_CLIENT_ID as string;
  //   const redirectUri = process.env.GOOGLE_REDIRECT_URI as string;
  //   const scope =
  //     'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  //   const responseType = 'code';
  
  //   const params = {
  //     client_id: clientId,
  //     redirect_uri: redirectUri,
  //     scope,
  //     response_type: responseType,
  //   };
  
  //   const queryString = qs.stringify(params);
  //   return `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;
  // };
  