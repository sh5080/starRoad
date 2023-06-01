import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status).send({
      error: {
        message: err.message,
      },
    });
  } else {
    res.status(500).send({
      error: {
        message: 'Unexpected error occurred',
      },
    });
  }
};

export { errorHandler, AppError };
