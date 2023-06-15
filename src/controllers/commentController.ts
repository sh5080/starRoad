import { NextFunction, Request, Response } from 'express';
import * as commentService from '../services/commentService';
import { getOneDiaryByDiaryId } from '../services/diaryService';
import { AppError, CommonError } from '../types/AppError';
import { CustomRequest } from '../types/customRequest';

/** 댓글 생성 */
export const createComment = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { diaryId, comment } = req.body;

    const username = req.user?.username;
    const diary = await getOneDiaryByDiaryId(Number(diaryId));
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '유효하지 않은 여행기입니다.', 404);
    }
    await commentService.createComment({
      username: username,
      diaryId,
      comment,
    });

    res.status(201).json({ diaryId, comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 여행기에 대한 댓글 조회 */
export const getCommentsByDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { diaryId } = req.params;
    const { page } = req.query;
    const limit = 10;
    const comments = await commentService.getCommentsByDiary(Number(diaryId), Number(page), Number(limit));
    if (comments[0] === undefined) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '댓글을 찾을 수 없습니다.', 404);
    }
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 댓글 수정 */
export const updateComment = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const username = req.user?.username;
    if (!comment) {
      throw new AppError(CommonError.INVALID_INPUT, '댓글을 입력해 주세요.', 400);
    }
    await commentService.updateComment({ comment }, Number(commentId), username as string);
    res.status(200).json({ message: comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 댓글 삭제 */
export const deleteComment = async (req: CustomRequest, res: Response, next:NextFunction) => {
  try {
    const { commentId } = req.params;
    const username = req.user?.username!;
    
    await commentService.deleteComment(Number(commentId), username);
    res.status(200).json({ message: '댓글 삭제가 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error)
  }
};
