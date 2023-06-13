import multer from 'multer';
import * as fs from 'node:fs';
import { AppError, CommonError } from '../../types/AppError';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'node:crypto';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    files: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, './public');
  },
  filename: function (req: Request, files: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    // 유니크한 파일명
    cb(null, crypto.randomUUID() + '-' + files.originalname);
  },
});

// 스토리지 초기화
const upload = multer({ storage: storage });

// 미들웨어 함수
export const processImage = (req: Request, res: Response, next: NextFunction) => {
  upload.array('image', 4)(req, res, (err) => {
    // upload.array 사용
    if (err) {
      return next(new AppError(CommonError.RESOURCE_NOT_FOUND, '업로드중 에러 발생', 400));
    } else {
      next();
    }
  });
};
