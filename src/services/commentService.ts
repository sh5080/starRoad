import { createCommentModel } from '../models/commentModel';
import { CommentType } from '../types/comment';
import { AppError } from '../api/middlewares/errorHandler';

export const createComment = async (comment: CommentType): Promise<void> => {
  try {
    const { userId, diaryId, comment: commentText } = comment;

    if (!userId) {
        throw new AppError('로그인이 필요합니다.', 401);
      }
      if (!diaryId) {
        throw new AppError('유효하지 않은 여행기입니다.', 400);
      }
      
      await createCommentModel({ userId, diaryId, comment: commentText });
      
  } catch (error) {
    throw new Error('댓글 생성 실패했습니다.');
  }
};
