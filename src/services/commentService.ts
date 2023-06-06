import { 
    createCommentModel,
    getCommentsByDiaryModel,
    getAllCommentsModel,
    updateCommentModel,
    getCommentModel,
    deleteCommentModel

} from '../models/commentModel';

import { CommentType } from '../types/comment';
import { AppError, CommonError } from '../api/middlewares/errorHandler';

export const createComment = async (comment: CommentType): Promise<void> => {
  try {
    const { user_id, diary_id, comment: commentText } = comment;

    await createCommentModel({ user_id, diary_id, comment: commentText });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new Error('댓글 생성 실패했습니다.');
    }
  }
};
export const getCommentsByDiary = async (diary_id: number, page: number, limit: number): Promise<CommentType[]> => {
    const comments = await getCommentsByDiaryModel(diary_id, page, limit); // pagination 적용
    return comments;
  };
  
  export const getAllComments = async (): Promise<CommentType[]> => {
    try {
      const comments = await getAllCommentsModel();
      return comments;
    } catch (error) {
      throw new Error('댓글 조회에 실패했습니다.');
    }
  };
  export const updateComment = async (newComment: CommentType, id: number, user_id: string): Promise<void> => {
    try {
      const existingComment = await getCommentModel(id);
      if (!existingComment) {
        throw new AppError(CommonError.INVALID_INPUT,'존재하지 않는 댓글입니다.', 404);
      }
  
      if (existingComment.user_id !== user_id) {
        throw new AppError(CommonError.UNAUTHORIZED_ACCESS,'댓글을 수정할 권한이 없습니다.', 403);
      }
  
      await updateCommentModel(id,newComment);
      
    } catch (error) {
      switch (error) {
        case CommonError.INVALID_INPUT:
          case CommonError.UNAUTHORIZED_ACCESS: 
          break;
          default:
            console.error(error);
            (new AppError(CommonError.UNEXPECTED_ERROR,'댓글 수정에 실패했습니다.', 500));
          }
    }
  };

  export const deleteComment = async (id: number, user_id: string) => {
    try {
      const comment = await getCommentModel(id);
      if (!comment) {
        throw new AppError(CommonError.RESOURCE_NOT_FOUND,'댓글을 찾을 수 없습니다.', 404);
      }
      if (comment.user_id !== user_id) {
        throw new AppError(CommonError.UNAUTHORIZED_ACCESS,'권한이 없습니다.', 403);
      }
      await deleteCommentModel(id);
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