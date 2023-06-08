import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../types/AppError';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  
  const { message, name, status } = err as AppError;
  const errorResponse = {
    error: {
      message,
      name,
      status
    },
  };
  res.status(500).json(errorResponse);

};

export { errorHandler, AppError };


