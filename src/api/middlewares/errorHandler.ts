import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const { message, name, status } = err;
  const errorResponse = {
    error: {
      message,
      name,
      status,
    },
  };
  res.status(status).json(errorResponse);
};

export { errorHandler };
