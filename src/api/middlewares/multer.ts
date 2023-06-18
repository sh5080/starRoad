import multer from 'multer';
import * as fs from 'node:fs';
import { AppError, CommonError } from '../../types/AppError';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'node:crypto';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
if (!fs.existsSync('public/compressed')) {
  fs.mkdirSync('public/compressed');
}

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    files: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, './public');
  },
  filename: function (req: Request, files: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, crypto.randomUUID() + '-' + files.originalname);
  },
});

const upload = multer({ storage: storage });

export const processImage = (req: Request, res: Response, next: NextFunction) => {
  upload.array('image', 4)(req, res, (err) => {
    // upload.array 사용
    if (err) {
      console.error(err)
      return next(new AppError(CommonError.RESOURCE_NOT_FOUND, '업로드중 에러 발생', 400));
      
    } else {
      next();
    }
  });
};
