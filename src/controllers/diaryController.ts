import { Request, Response, NextFunction } from 'express';
import * as diaryService from '../services/diaryService';
import { AppError, CommonError } from '../types/AppError';
import { CustomRequest } from '../types/customRequest';

export const createDiaryController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, image, plan_id, ...extraFields } = req.body;
    const username = req.user?.username;

    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    if (!title || !content) {
      throw new AppError(CommonError.INVALID_INPUT, '제목, 본문은 필수 입력 항목입니다.', 400);
    }

    if (Object.keys(extraFields).length > 0) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 입력입니다.', 400);
    }

    const diary = await diaryService.createDiary(
      { username, plan_id, title, content, image },
      username,
      Number(plan_id)
    );
    res.status(201).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllDiaries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 다이어리 조회
    const diary = await diaryService.getAllDiaries();
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '전체 여행기를 찾을 수 없습니다.', 404);
    }
    res.status(200).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getMyDiaries = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const username = req.user?.username;
    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    const diaries = await diaryService.getMyDiaries(username);
    res.status(200).json(diaries);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getOneDiary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diary_id = parseInt(req.params.diary_id, 10);
    const diary = await diaryService.getOneDiary(diary_id);

    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    res.status(200).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const diary_id = parseInt(String(req.params.diary_id), 10);
    const { title, content, image, ...extraFields } = req.body;
    const username = req.user?.username;
    const diaryData = { title, content, image };
    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    if (Object.keys(extraFields).length > 0) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 입력입니다.', 400);
    }
    if (!title || !content) {
      throw new AppError(CommonError.INVALID_INPUT, '제목, 본문은 필수 입력 항목입니다.', 400);
    }
    await diaryService.updateDiary(diaryData, diary_id, username);
    res.status(200).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const diary_id = parseInt(String(req.params.diary_id), 10);
    const username = req.user?.username;
    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    const deletedDiary = await diaryService.deleteDiary(diary_id, username);

    res.status(200).json(deletedDiary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
