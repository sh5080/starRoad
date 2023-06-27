import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/customRequest';

export const ensureAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '관리자 권한이 없습니다.' });
  }
  next();
};
