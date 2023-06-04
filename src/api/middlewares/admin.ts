import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload & { userId: string };
}

export const ensureAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    next(new AppError('관리자 권한이 필요합니다.', 403));
  }
  next();
};
