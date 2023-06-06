import { Application, Request, Response } from 'express';
import userRouter from '../api/routes/userRoutes';
import mypageRouter from '../api/routes/mypageRoutes';
import travelRouter from '../api/routes/travelRoutes';
import diaryRouter from '../api/routes/diaryRoutes';
import commentRouter from '../api/routes/commentRoutes';
import adminRouter from '../api/routes/adminRoutes';

const routeLoader = (app: Application): Application => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the homepage!');
  });

  app.use('/users', userRouter);
  app.use('/mypage',mypageRouter);
  app.use('/travels', travelRouter);
  app.use('/diaries', diaryRouter);
  app.use('/comments', commentRouter);
  app.use('/admin', adminRouter);

  return app;
};

export default routeLoader;
