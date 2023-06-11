import { NextFunction, Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { getOneDiary } from '../services/diaryService';
import { AppError, CommonError } from '../types/AppError';
import { CustomRequest } from '../types/customRequest';

export const createCommentController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { diary_id, comment, ...extraFields } = req.body;

    const loggedInUsername = req.user?.username;
    if (!loggedInUsername) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }

    const diary = await getOneDiary(Number(diary_id));
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '유효하지 않은 여행기입니다.', 404);
    }
    await commentService.createComment({
      username: loggedInUsername,
      diary_id,
      comment,
    });
    if (Object.keys(extraFields).length > 0) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 입력입니다.', 400);
    }
    res.status(201).json({ diary_id, comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getCommentsByDiaryController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { diary_id } = req.params;
    const { page } = req.query;
    const limit = 10;
    const comments = await commentService.getCommentsByDiary(Number(diary_id), Number(page), Number(limit));
    if (comments[0] === undefined) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '댓글을 찾을 수 없습니다.', 404);
    }
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateCommentController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { comment_id } = req.params;
    const { comment, ...extraFields } = req.body;
    const username = req.user?.username;
    if (!comment) {
      throw new AppError(CommonError.INVALID_INPUT, '댓글을 입력해 주세요.', 400);
    }
    if (Object.keys(extraFields).length > 0) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 입력입니다.', 400);
    }

    await commentService.updateComment({ comment }, Number(comment_id), username as string);
    res.status(200).json({message : comment});
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteCommentController = async (req: CustomRequest, res: Response, next:NextFunction) => {
  try {
    const { comment_id } = req.params;
    const username = req.user?.username;

    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    await commentService.deleteComment(Number(comment_id), username);
    res.status(200).json({ message: '댓글 삭제가 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error)
  }
};
