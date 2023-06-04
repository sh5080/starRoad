import { Application, Request, Response } from 'express';
import userRouter from '../api/routes/useRoutes';
import travelRouter from '../api/routes/travelRoutes';
import diaryRouter from '../api/routes/diaryRoutes';
import adminRouter from '../api/routes/adminRoutes';

const routeLoader = (app: Application): Application => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the homepage!');
  });

  app.use('/users', userRouter);
  app.use('/travels', travelRouter);
  app.use('/diaries', diaryRouter);
  app.use('/admin', adminRouter);
  return app;
};

export default routeLoader;
