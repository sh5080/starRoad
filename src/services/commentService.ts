import { 
    createCommentModel,

} from '../models/commentModel';

import { CommentType } from '../types/comment';
import { AppError } from '../api/middlewares/errorHandler';

export const createComment = async (comment: CommentType): Promise<void> => {
  try {
    const { userId, diaryId, comment: commentText } = comment;
  
      await createCommentModel({ userId, diaryId, comment: commentText });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new Error('댓글 생성 실패했습니다.');
      
    }
  }
};