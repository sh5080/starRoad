import { NextFunction, Request, Response } from 'express';
import { 
    createComment,
    getCommentsByDiary,
    getAllComments,
    updateComment,
    deleteComment

} from '../services/commentService';
import { getOneDiary } from '../services/diaryService';
import { AppError, CommonError } from '../api/middlewares/errorHandler';
import { CustomRequest } from '../types/customRequest';

export const createCommentController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { diary_id, comment } = req.body;

    const loggedInUserId = req.user?.user_id;

    if (!loggedInUserId) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,'사용자 아이디가 일치하지 않습니다.', 401);
    }

    const diary = await getOneDiary(Number(diary_id));
    if (!diary) {
      return next(new AppError(CommonError.RESOURCE_NOT_FOUND,'유효하지 않은 여행기입니다.', 401));
    }

    const createdCommentId = await createComment({ user_id: loggedInUserId, diary_id, comment });

    res.status(201).json({ id: createdCommentId, message: '댓글이 생성되었습니다.' });
  } catch (error) {
    switch (error) {
      case CommonError.AUTHENTICATION_ERROR:
      case CommonError.RESOURCE_NOT_FOUND:
        next(error);
        break;
      default:
        console.error(error);
        next(new AppError(CommonError.UNEXPECTED_ERROR,'댓글 생성에 실패했습니다.', 500));
      }
  }
};
export const getCommentsByDiaryController = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { diary_id } = req.params;
        const { page, limit } = req.query; 

      const loggedInUserId = req.user?.user_id;
    
      if (!loggedInUserId) {
        throw new AppError(CommonError.AUTHENTICATION_ERROR,'사용자 아이디가 일치하지 않습니다.', 401);
      }
    
      const comments = await getCommentsByDiary(Number(diary_id), Number(page), Number(limit));
    
      res.status(200).json({ comments });
    }  catch (error) {
      switch (error) {
        case CommonError.AUTHENTICATION_ERROR:
          break;
          default:
            console.error(error);
            next(new AppError(CommonError.UNEXPECTED_ERROR,'댓글 조회에 실패했습니다.', 500));
      }
    }
  };
  export const getAllCommentsController = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const comments = await getAllComments();
      res.status(200).json(comments);
    } catch (error) {
      switch (error) {
        case CommonError.AUTHENTICATION_ERROR:
          break;
          default:
            console.error(error);
            next(new AppError(CommonError.UNEXPECTED_ERROR,'댓글 조회에 실패했습니다.', 500));
      }
    }    
  };
  export const updateCommentController = async (req: CustomRequest ,res: Response, next:NextFunction) => {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      const user_id = req.user?.user_id;
      if (comment === undefined) {
        throw new AppError(CommonError.INVALID_INPUT, '댓글을 입력해 주세요.',400);
      }
      const existingComment = await updateComment({ comment }, Number(id), user_id as string);

      if (existingComment===null) {
        throw new AppError(CommonError.RESOURCE_NOT_FOUND, '존재하지 않는 댓글입니다.', 404);
      }
      if (comment !== user_id) {
        throw new AppError(CommonError.UNAUTHORIZED_ACCESS,'댓글을 수정할 권한이 없습니다.', 403);
      }

     // await updateComment({comment}, Number(id), user_id as string);
      res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.' });
    } catch (error) {
      switch (error) {
          case CommonError.INVALID_INPUT:
          case CommonError.RESOURCE_NOT_FOUND:
          case CommonError.UNAUTHORIZED_ACCESS:
          break;
          default:
            console.error(error);
            next(new AppError(CommonError.UNEXPECTED_ERROR,'댓글 수정에 실패했습니다.', 500));
      }
    }
  };


  export const deleteCommentController = async (req: CustomRequest, res: Response) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.user_id;
  
      if (!user_id) {
        throw new AppError(CommonError.AUTHENTICATION_ERROR,'사용자 정보를 찾을 수 없습니다.', 401);
      }
  
      await deleteComment(Number(id), user_id);
  
      res.status(200).json({ message: '댓글 삭제가 완료되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
    }
  };