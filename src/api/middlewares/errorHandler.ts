import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../types/AppError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    const { message, name, status } = err;
    const errorResponse = {
      error: {
        message,
        name,
        status,
      },
    };
    res.status(status).json(errorResponse);
  } else {
    res.status(500).json({ error: { message: err.message || 'Unexpected Error' } });
  }
};

export { errorHandler, AppError };
