import express, { Application, Request, Response } from 'express';
import userRouter from '../api/routes/userRoutes';
import travelRouter from '../api/routes/travelRoutes';
import diaryRouter from '../api/routes/diaryRoutes';
import commentRouter from '../api/routes/commentRoutes';
import adminRouter from '../api/routes/adminRoutes';
import destinationRouter from '../api/routes/destinationRoutes';
import axios from 'axios';
import config from '../config/index';
import path from 'path';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = config.google;
const { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI } = config.kakao;
const routeLoader = (app: Application): Application => {
  
  // 배포시
  // app.use(express.static(path.join(__dirname, '../../../frontend/dist')));


  app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
  });

  app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    // oauth 위임을 위한 절차
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
      });
      // console.log(GOOGLE_CLIENT_ID);
      const accessToken = response.data.access_token;

      // 구글에서 유저인포 가져오기위한작업
      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(userInfo.data);
      // 최소한으로 db 에 저장해야 회원가입.
      // email과 가입유형
      // 따로나눠서 저장
      // email이 존재하면 로그인

      res.send('Logged in successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Authentication failed.');
    }
  });
  app.get('/auth/kakao/callback', async (req, res) => {
    const code = req.query.code;

    // 카카오 OAuth 토큰 요청
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      });

      const accessToken = response.data.access_token;

      // 카카오 사용자 정보 요청
      const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userInfo = userInfoResponse.data;
      console.log(userInfo);
      // 최소한으로 DB에 저장해야 하는 정보 (카카오에서 제공하는 사용자 고유 ID를 저장하는 것이 좋습니다.)

      res.send('Logged in successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Authentication failed.');
    }
  });

  app.use('/static',express.static('public')) // 클라우드 서버에서느 필요없음 ( nginx가 대신함 )
  app.use('/destinations', destinationRouter);
  app.use('/users', userRouter);
  app.use('/travels', travelRouter);
  app.use('/diaries', diaryRouter);
  app.use('/comments', commentRouter);
  app.use('/admin', adminRouter);

  return app;
};

export default routeLoader;
