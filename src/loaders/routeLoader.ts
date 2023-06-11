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
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = config.google;
const routeLoader = (app: Application): Application => {
  // 배포시
  // app.use(express.static(path.join(__dirname, '../../../frontend/dist')));
  // app.get('/', (req: Request, res: Response) => {
  //   res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
  // });

  app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    // oauth 위임을 위한 절차
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code', // 임시 코드
      });
      const accessToken = response.data.access_token;

      // 구글에서 유저인포 가져오기위한작업
      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(userInfo.data);
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
  app.use('/static', express.static('public')); // 정적파일 관리 경로
  app.use('/destinations', destinationRouter);
  app.use('/users', userRouter);
  app.use('/travels', travelRouter);
  app.use('/diaries', diaryRouter);
  app.use('/comments', commentRouter);
  app.use('/admin', adminRouter);

  return app;
};

export default routeLoader;
