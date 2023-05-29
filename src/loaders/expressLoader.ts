import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from '../api/routes/useRoutes';
import { dbLoader } from '../loaders/dbLoader';

export default async function expressLoader(app: express.Application) {
  app.use(bodyParser.json());

  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
  });

  app.use('/users', userRoutes);

  const db = await dbLoader();
  app.set('db', db);

  return app;
}
