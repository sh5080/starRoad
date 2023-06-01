import { Application, Request, Response } from 'express';
import userRoutes from '../api/routes/useRoutes';

const routeLoader = (app: Application): Application => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the homepage!');
  });

  app.use('/users', userRoutes);

  return app;
};

export default routeLoader;
