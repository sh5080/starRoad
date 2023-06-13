import * as authService from '../services/authService';
import { NextFunction, Request, Response } from 'express';
import config from '../config/index';
import { AppError, CommonError } from '../types/AppError';
import axios from 'axios';
import { JwtPayload } from 'jsonwebtoken';
interface CustomRequest extends Request {
    user?: JwtPayload & { username: string };
  }

const { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI } = config.kakao;

export const kakaoLogin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code;
  
      // 카카오 OAuth 토큰 요청
      const response = await axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
          
      });
  
      const accessToken = response.data.access_token;
  
      // 카카오 사용자 정보 요청
      const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const kakaoUserInfo = userInfoResponse.data;
  
      // 카카오 사용자 정보에서 이메일을 가져옵니다.
      const email = kakaoUserInfo.kakao_account.email;
  
      // 이메일을 기준으로 기존에 회원 가입되어 있는지 확인
      const existingUser = await authService.getUserForOauth(email);
  
      if (existingUser) {
        // 기존에 회원 가입되어 있는 경우, 해당 유저로 로그인
        const token = await authService.OauthLoginUser(existingUser.username || '');
  
        // 토큰을 쿠키에 설정하고 클라이언트에게 보냄
        console.log('token= ', token);
        res.cookie('token', token, {
          httpOnly: true,
          // secure: true, // Uncomment this line if you're serving over HTTPS
          maxAge: 7200000, // 쿠키의 유효 시간 설정(예: 2 hours)
          // sameSite: 'none', // SameSite 옵션 설정
          // 필요에 따라 쿠키 설정을 추가할 수 있습니다.
        });
  
        res.status(200).json({ message: 'Logged in successfully!', user: existingUser });
      } else {
        // 기존에 회원 가입되어 있지 않은 경우, 회원 가입 처리 또는 에러 처리를 수행
        const newUser = await authService.OauthSignupUser(email);
        const token = await authService.OauthLoginUser(newUser.username);
        
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 7200000,
  
        });
  
        res.status(200).json({ message: '카카오로 로그인되었습니다.', user: newUser });
        throw new AppError(CommonError.RESOURCE_NOT_FOUND, '회원 가입되어 있지 않습니다.', 404);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  
  
export const googleLogin = (req: Request, res: Response) => {
    const loginUrl = authService.generateLoginUrl();
    res.redirect(loginUrl);
  };
  
  export const googleCallback = async (req: Request, res: Response) => {
    const { code } = req.query;
    try {
      const user = await authService.getUserInfo(code as string);
      // 추가적인 로직 수행
  
      res.send('구글 로그인이 완료되었습니다.');
    } catch (error) {
      console.error('구글 로그인 에러:', error);
      res.status(500).send('구글 로그인 중 오류가 발생했습니다.');
    }
  };