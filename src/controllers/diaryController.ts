import { Request, Response } from 'express';
import { 
    createDiary, 
    deleteDiary, 
    getAllDiary, 
    getMyDiary, 
    getOneDiary, 
    updateDiary 
} from '../services/diaryService';

import { AppError, CommonError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';
import { NextFunction } from 'connect';
interface CustomRequest extends Request {
    user?: JwtPayload & { user_id: string };
  }
export const createDiaryController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, image, plan_id } = req.body;
    const user_id = req.user?.user_id;

    if (!user_id) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,
        '사용자 정보를 찾을 수 없습니다.', 401);
    }
    // const plan = await getPlanById(plan_id, user_id);
    // if (!plan) {
    //   throw new AppError(CommonError.UNAUTHORIZED_ACCESS,
    //     '해당 일정에 대한 여행기를 작성할 권한이 없습니다.', 404);
    // }
    // const { destination } = plan; // 플랜의 destination 값

    // diary 생성
    await createDiary({ user_id, plan_id, title, content, image }, user_id, plan_id);
    res.status(201).json({ message: '여행기가 생성되었습니다.' });
  } catch (error) {
    switch (error) {
      case CommonError.AUTHENTICATION_ERROR:
        next(error);
        break;
      default:
        //console.error(error);
        res.status(500).json({ error: '여행기 생성 실패했습니다.' });
    }
  }
};

export const getAllDiaryController = async (req: Request, res: Response) => {
  try {
      // 다이어리 조회
      const diary = await getAllDiary();
      if (!diary) {
        throw new AppError(CommonError.RESOURCE_NOT_FOUND,
          '전체 여행기를 찾을 수 없습니다.', 404);
      }
      res.status(200).json(diary);
    } catch (error) {
      switch (error) {
        case CommonError.AUTHENTICATION_ERROR:
        case CommonError.UNAUTHORIZED_ACCESS:
          break;
        default:
          //console.error(error);
          res.status(500).json({ error: '전체 여행기 조회에 실패했습니다.' });
      }
    }
  };
  export const getMyDiaryController = async (req: CustomRequest, res: Response) => {
      try {
        const user_id = req.user?.user_id;
        if (!user_id) {
          throw new AppError(CommonError.AUTHENTICATION_ERROR,
            '사용자 정보를 찾을 수 없습니다.', 401);
        }
        const diaries = await getMyDiary(user_id);
    
        res.status(200).json(diaries);
      } catch (error) {
        switch (error) {
          case CommonError.AUTHENTICATION_ERROR:
            break;
          default:
            //console.error(error);
            res.status(500).json({ error: '내 여행기 조회에 실패했습니다.' });
        }
      }
    };
export const getOneDiaryController = async (req: Request, res: Response) => {
    try {
      const diary_id = parseInt(req.params.diary_id, 10);
      const diary = await getOneDiary(diary_id);
    
      if (!diary) {
        throw new AppError(CommonError.RESOURCE_NOT_FOUND,
          '여행기를 찾을 수 없습니다.', 404);
      }
      res.status(200).json(diary);
    }catch (error) {
      switch (error) {
        case CommonError.RESOURCE_NOT_FOUND:
          break;
        default:
          //console.error(error);
          res.status(500).json({ error: '여행기 조회에 실패했습니다.' });
      }
    }
  };

export const updateDiaryController = async (req: CustomRequest, res: Response) => {
  try {
    const diary_id = parseInt(req.params.diary_id, 10);
    const { diary } = req.body;
    const user_id = req.user?.user_id;

    if (!user_id) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,
        '사용자 정보를 찾을 수 없습니다.', 401);
    }

    await updateDiary(diary, diary_id, user_id);

    res.status(200).json({ message: '여행기 수정이 완료되었습니다.' });
  }catch (error) {
    switch (error) {
      case CommonError.AUTHENTICATION_ERROR:
        break;
      default:
        //console.error(error);
        res.status(500).json({ error: '여행기 수정에 실패했습니다.' });
    }
  }
};


export const deleteDiaryController = async (req: CustomRequest, res: Response) => {
  try {
    const diary_id = parseInt(req.params.diary_id, 10);
    const user_id = req.user?.user_id;
    console.log(user_id)
    if (!user_id) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,
        '사용자 정보를 찾을 수 없습니다.', 401);
    }
    await deleteDiary(diary_id, user_id);

    res.status(200).json({ message: '여행기 삭제가 완료되었습니다.' });
  }catch (error) {
    switch (error) {
      case CommonError.AUTHENTICATION_ERROR:
        break;
      default:
        //console.error(error);
        res.status(500).json({ error: '여행기 삭제에 실패했습니다.' });
    }
  }
  };