import multer from 'multer';
import fs from 'fs';
import { AppError, CommonError } from '../../types/AppError';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, './public');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    // With unique filename using uuid
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

// Initialize upload
const upload = multer({ storage: storage });

// 미들웨어 함수
export const processImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('imageFile')(req, res, (err) => {
    if (err) {
      return next(new AppError(CommonError.RESOURCE_NOT_FOUND, '업로드중 에러 발생', 400));
    } else {
      next();
    }
  });
};
