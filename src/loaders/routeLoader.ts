import express, { Application, Request, Response } from 'express';
import userRouter from '../api/routes/userRoutes';
import travelRouter from '../api/routes/travelRoutes';
import diaryRouter from '../api/routes/diaryRoutes';
import commentRouter from '../api/routes/commentRoutes';
import adminRouter from '../api/routes/adminRoutes';
import axios from 'axios';
import config from '../config/index';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = config.google;
const routeLoader = (app: Application): Application => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the homepage!');
  });

  app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      });
      const accessToken = response.data.access_token;

      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(userInfo.data);
      res.send('Logged in successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Authentication failed.');
    }
  });

  app.use('/static', express.static('public')); // 정적파일 관리 경로
  app.use('/users', userRouter);
  app.use('/travels', travelRouter);
  app.use('/diaries', diaryRouter);
  app.use('/comments', commentRouter);
  app.use('/admin', adminRouter);

  return app;
};

export default routeLoader;
