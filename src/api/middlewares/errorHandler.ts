import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../types/AppError';
const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status).send({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  } else {
    res.status(500).send({
      error: {
        //message: 'Unexpected error occurred',
        message: err instanceof Error ? err.message : 'Unexpected error occurred',
      },
    });
  }
};

export { errorHandler, AppError };
