import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string; role: string };
}
export const ensureAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    console.log(req.user);
    return res.status(403).json({ message: '관리자 권한이 없습니다.' });
  }
  next();
};
