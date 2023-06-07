import { Application, Request, Response } from 'express';
import userRouter from '../api/routes/userRoutes';
import travelRouter from '../api/routes/travelRoutes';
import diaryRouter from '../api/routes/diaryRoutes';
import commentRouter from '../api/routes/commentRoutes';
import adminRouter from '../api/routes/adminRoutes';
import axios from 'axios';

const routeLoader = (app: Application): Application => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the homepage!');
  });

  // app.get('/', (req: Request, res: Response) => {
  //   res.sendFile('../index.html');
  // });
  app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const clientId = '967078246054-hjffdp6i565eor8l6b0390gm18uuvn60.apps.googleusercontent.com';
    const clientSecret = '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';
    const redirectUri = 'http://localhost:3000/auth/callback';

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      const accessToken = response.data.access_token;
      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(userInfo.data);
      // db에 저장하던지 말던지... 

      // You now have the user's information, and can use it to set up a session, etc.
      // 
      res.send('Logged in successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Authentication failed.');
    }
  });

  app.use('/users', userRouter);
  app.use('/travels', travelRouter);
  app.use('/diaries', diaryRouter);
  app.use('/comments', commentRouter);
  app.use('/admin', adminRouter);

  return app;
};

export default routeLoader;
