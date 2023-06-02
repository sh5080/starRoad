import { Application, Request, Response } from 'express';
import userRouter from '../api/routes/useRoutes';
import travelRouter from '../api/routes/travelRoutes';

const routeLoader = (app: Application): Application => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the homepage!');
  });

  app.use('/users', userRouter);
  app.use('/travels', travelRouter);

  return app;
};

export default routeLoader;
