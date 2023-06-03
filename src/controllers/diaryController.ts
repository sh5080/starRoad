import { Request, Response } from 'express';
import { createDiary, deleteDiary, getAllDiary, getMyDiary, getOneDiary, updateDiary } from '../services/diaryService';


import { AppError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';
import { getPlanById } from '../models/diaryModel';

interface CustomRequest extends Request {
    user?: JwtPayload & { userId: string };
  }

  export const createDiaryController = async (req: CustomRequest, res: Response) => {
    try {
      const { title, content, image, planId } = req.body;
      const userId = req.user?.userId;
  
      if (!userId) {
        throw new AppError('사용자 정보를 찾을 수 없습니다.', 401);
      }
  
      // 해당 유저의 플랜인지 유효성 검사
      const plan = await getPlanById(planId, userId);
      if (!plan) {
        throw new AppError('플랜을 찾을 수 없습니다.', 404);
      }
  
      const { destination } = plan; // 플랜의 destination 값
  
      // diary 생성
      await createDiary({ userId, planId, title, content, image, destination }, plan);
  
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
    export const getMyDiaryController = async (req: CustomRequest, res: Response) => {
        try {
          const userId = req.params.userId;
      
          if (!userId) {
            throw new AppError('사용자 정보를 찾을 수 없습니다.', 401);
          }
          const loggedInUserId = req.user?.userId; 
          if (userId !== loggedInUserId) {
            throw new AppError('사용자 아이디가 일치하지 않습니다.', 403);
          }
          const diaries = await getMyDiary(userId);
      
          res.status(200).json(diaries);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: '내 여행기 조회에 실패했습니다.' });
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

export const deleteDiaryController = async (req: CustomRequest, res: Response) => {
    try {
      const diaryId = parseInt(req.params.diaryId, 10);
      const userId = req.user?.userId;
  
      if (!userId) {
        throw new AppError('사용자 정보를 찾을 수 없습니다.', 401);
      }
  
      await deleteDiary(diaryId, userId);
  
      res.status(200).json({ message: '여행기 삭제가 완료되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '여행기 삭제에 실패했습니다.' });
    }
  };