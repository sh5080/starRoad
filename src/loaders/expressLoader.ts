import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { dbLoader } from '../loaders/dbLoader';
import { errorHandler } from '../api/middlewares/errorHandler';
import routeLoader from './routeLoader';

export default async function expressLoader(app: Application): Promise<Application> {
  try {
    const db = await dbLoader();  
    
    app.use(bodyParser.json());
  
    app.use(cors());
  
    routeLoader(app);
  
    app.set('db', db); 
    app.use(errorHandler);
  
    return app;
  } catch (error) {
    console.error('Error occurred during Express loader initialization:', error);
    throw error;
  }
}
