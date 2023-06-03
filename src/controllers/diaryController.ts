import { Request, Response } from 'express';
import { createDiary, getAllDiary, getOneDiary, updateDiary } from '../services/diaryService';


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
  export const getAllDiaryController = async (req: Request, res: Response) => {
    try {
        // 다이어리 조회
        const diary = await getAllDiary();
    
        if (!diary) {
          throw new AppError('전체 여행기를 찾을 수 없습니다.', 404);
        }
    
        res.status(200).json(diary);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: '전체 여행기 조회에 실패했습니다.' });
      }
    };
  export const getOneDiaryController = async (req: Request, res: Response) => {
      try {
        const diaryId = parseInt(req.params.diaryId, 10);
        const diary = await getOneDiary(diaryId);
      
        if (!diary) {
          return res.status(404).json({ error: '여행기를 찾을 수 없습니다.' });
        }
      
        res.status(200).json(diary);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: '여행기 조회에 실패했습니다.' });
      }
    };

export const updateDiaryController = async (req: CustomRequest, res: Response) => {
  try {
    const { diary, diaryId } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('사용자 정보를 찾을 수 없습니다.', 401);
    }

    await updateDiary(diary, diaryId, userId);

    res.status(200).json({ message: '여행기 수정이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '여행기 수정에 실패했습니다.' });
  }
};