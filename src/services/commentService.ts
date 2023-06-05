import { 
    createCommentModel,
    getCommentsByDiaryModel,
    getAllCommentsModel,
    updateCommentModel,
    getCommentModel,
    deleteCommentModel

} from '../models/commentModel';

import { CommentType } from '../types/comment';
import { AppError } from '../api/middlewares/errorHandler';

export const createComment = async (comment: CommentType): Promise<void> => {
  try {
    const { user_id, diary_id, comment: commentText } = comment;

    await createCommentModel({ user_id, diary_id, comment: commentText });
   // await createCommentModel(comment);
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
  export const updateComment = async (newComment: CommentType, comment_id: number, user_id: string): Promise<void> => {
    try {
      const existingComment = await getCommentModel(comment_id);
      if (!existingComment) {
        throw new AppError('존재하지 않는 댓글입니다.', 404);
      }
  
      if (existingComment.user_id !== user_id) {
        throw new AppError('댓글을 수정할 권한이 없습니다.', 403);
      }
  
      await updateCommentModel(comment_id,newComment);
      
    } catch (error) {
      throw new Error('댓글 수정에 실패했습니다.');
    }
  };

  export const deleteComment = async (comment_id: number, user_id: string) => {
    try {
      const comment = await getCommentModel(comment_id);
      if (!comment) {
        throw new AppError('댓글을 찾을 수 없습니다.', 404);
      }
      if (comment.user_id !== user_id) {
        throw new AppError('권한이 없습니다.', 403);
      }
  
      await deleteCommentModel(comment_id);
  
      return '댓글 삭제가 완료되었습니다.';
    } catch (error) {
      console.error(error);
      throw new AppError('댓글 삭제에 실패했습니다.', 500);
    }
  };