import { Request, Response } from 'express';
import { createDiary } from '../services/diaryService';
import { AppError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: JwtPayload & { userId: string };
  }

  export const createDiaryController = async (req: CustomRequest, res: Response) => {
    try {
      const { title, content, image } = req.body;
      const userId = req.user?.userId;
  
      if (!userId) {
        throw new AppError('사용자 정보를 찾을 수 없습니다.', 401);
      }
      await createDiary({ userId, title, content, image });
  
      res.status(201).json({ message: '여행기가 생성되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '여행기 생성에 실패했습니다.' });
    }
  };