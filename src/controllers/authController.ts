import * as authService from '../services/authService';
import { NextFunction, Request, Response } from 'express';
import config from '../config/index';
import qs from 'qs';
import axios from 'axios';
import { JwtPayload } from 'jsonwebtoken';
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = config.google;
const { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI } = config.kakao;

interface CustomRequest extends Request {
  user?: JwtPayload & { username: string };
}
const SERVER_URL = config.server.SERVER_URL;

/** 카카오 로그인 */
export const kakaoLogin = (req: CustomRequest, res: Response, next: NextFunction) => {
  const loginUrl = authService.generateLoginUrl('kakao');
  res.redirect(loginUrl);
};

/** 구글 로그인 */
export const googleLogin = (req: CustomRequest, res: Response, next: NextFunction) => {
  const loginUrl = authService.generateLoginUrl('google');
  res.redirect(loginUrl);
};

/** 카카오 로그인 콜백 */
export const kakaoCallback = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code;

    // 카카오 OAuth 토큰 요청
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );

    const accessToken = response.data.access_token;

    // 카카오 사용자 정보 요청
    const kakaoInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const kakaoUserInfo = kakaoInfo.data;

    // 카카오 사용자 정보에서 이메일을 가져옵니다.
    const kakaoEmail = kakaoUserInfo.kakao_account.email;

    // 이메일을 기준으로 기존에 회원 가입되어 있는지 확인
    const existingInfo = await authService.getUserForOauth(kakaoEmail);

    if (existingInfo !== null) {
      // 기존에 회원 가입되어 있는 경우, 해당 유저로 로그인
      const token = await authService.OauthLoginUser(existingInfo.username || '');

      // 토큰을 쿠키에 설정하고 클라이언트에게 보냄
      res.cookie('token', token, {
        // httpOnly: true,
        secure: true,
        maxAge: 7200000,
      });

      res.redirect(`http://localhost:5173`);
      // res.redirect(`https://www.starroad.site`);
    } else {
      // 기존에 회원 가입되어 있지 않은 경우, 회원 가입 처리 또는 에러 처리를 수행
      try {
        const newInfo = await authService.OauthSignupUser({
          username: kakaoEmail,
          email: kakaoEmail,
          oauthProvider: 'kakao',
        });
        res.redirect(`http://localhost:5173`);
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 구글 로그인 콜백 */
export const googleCallback = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const code = req.query.code;

  // oauth 위임을 위한 절차
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const accessToken = response.data.access_token;

    // 구글에서 유저 정보 가져오기
    const googleInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const googleEmail = googleInfo.data.email;

    // 기존 사용자 여부 이메일로 확인
    const existingInfo = await authService.getUserForOauth(googleEmail);

    // 회원가입 및 로그인 처리 등 필요한 로직 수행
    if (existingInfo) {
      // 기존에 회원 가입되어 있는 경우, 해당 유저로 로그인
      const token = await authService.OauthLoginUser(existingInfo.username || '');

      // 토큰을 쿠키에 설정하고 클라이언트에게 보냄
      res.cookie('token', token, {
        maxAge: 7200000,
        httpOnly: true,
      });

      // res.redirect(`http://localhot:5173`);
      res.redirect(`http://localhost:5173`);
    } else {
      // 기존에 회원 가입되어 있지 않은 경우, 회원 가입 처리 또는 에러 처리를 수행
      try {
        const newInfo = await authService.OauthSignupUser({
          username: googleEmail,
          email: googleEmail,
          oauthProvider: 'google',
        });
        res.redirect(`http://localhost:5173`);
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
