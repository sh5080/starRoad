import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { db } from '../loaders/dbLoader';
import {errorHandler} from '../api/middlewares/errorHandler';
import routeLoader from './routeLoader'; // import routeLoader

export default async function expressLoader(app: Application): Promise<Application> {
  app.use(bodyParser.json());

  app.use(cors());

  // 라우터 세팅
  routeLoader(app); // use routeLoader

  // db 세팅
  app.set('db', db);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
