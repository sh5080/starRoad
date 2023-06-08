import * as commentModel from '../models/commentModel';

import { Comment } from '../types/comment';
import { AppError,CommonError } from "../types/AppError";


export const createComment = async (comment: Comment): Promise<void> => {
  try {
    const { username, diary_id, comment: commentText } = comment;

    await commentModel.createCommentModel({ username, diary_id, comment: commentText });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new Error('댓글 생성 실패했습니다.');
    }
  }
};
export const getCommentsByDiary = async (diary_id: number, page: number, limit: number): Promise<Comment[]> => {
    const comments = await commentModel.getCommentsByDiaryModel(diary_id, page, limit); // pagination 적용
    return comments;
  };
  
  export const getAllComments = async (): Promise<Comment[]> => {
    try {
      const comments = await commentModel.getAllCommentsModel();
      return comments;
    } catch (error) {
      throw new Error('댓글 조회 실패했습니다.');
    }
  };
  export const updateComment = async (newComment: Comment, id: number, username: string): Promise<void> => {
    try {
      const existingComment = await commentModel.getCommentModel(id);
      if (!existingComment) {
        throw new AppError(CommonError.INVALID_INPUT,'존재하지 않는 댓글입니다.', 404);
      }
  
      if (existingComment.username !== username) {
        throw new AppError(CommonError.UNAUTHORIZED_ACCESS,'댓글을 수정할 권한이 없습니다.', 403);
      }
  
      await commentModel.updateCommentModel(id,newComment);
      
    } catch (error) {
      switch (error) {
        case CommonError.INVALID_INPUT:
          case CommonError.UNAUTHORIZED_ACCESS: 

          default:
            console.error(error);
            (new AppError(CommonError.UNEXPECTED_ERROR,'댓글 수정에 실패했습니다.', 500));
          }
    }
  };

  export const deleteComment = async (id: number, username: string) => {
    try {
      const comment = await commentModel.getCommentModel(id);
      if (!comment) {
        throw new AppError(CommonError.RESOURCE_NOT_FOUND,'댓글을 찾을 수 없습니다.', 404);
      }
      if (comment.username !== username) {
        throw new AppError(CommonError.UNAUTHORIZED_ACCESS,'권한이 없습니다.', 403);
      }
      await commentModel.deleteCommentModel(id);
      return '댓글 삭제가 완료되었습니다.';
    } catch (error) {
      switch (error) {
        case CommonError.RESOURCE_NOT_FOUND:
          case CommonError.UNAUTHORIZED_ACCESS: 
          break;
          default:
            console.error(error);
            (new AppError(CommonError.UNEXPECTED_ERROR,'댓글 삭제에 실패했습니다.', 500));
          }
        }
  };