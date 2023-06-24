import multer from 'multer';
import * as fs from 'node:fs';

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
  filename: function (
    req: Request, 
    files: Express.Multer.File, 
    cb: (error: Error | null, filename: string) => void
    ) {
    cb(null, crypto.randomUUID() + '-' + files.originalname);
  },
});

const upload = multer({ storage: storage });

export const processImage = (req: Request, res: Response, next: NextFunction) => {
  // multer 미들웨어를 라우터 핸들러 함수 내에서 호출
  upload.array('image', 4)(req, res, (err) => {
    if (err) {
      console.error(err);
      return next(err); // 에러를 다음 미들웨어로 전달
    }

    // 파일 업로드 성공한 경우
    const files = req.files as Express.Multer.File[];
    files.forEach((file) => {
      // 업로드된 파일의 정보를 활용하여 추가 작업 수행
      console.log('Uploaded file:', file.filename);
    });

    next();
  });
};