import { 
    createCommentModel,
    getCommentsByDiaryModel

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
export const getCommentsByDiary = async (diaryId: number, page: number, limit: number): Promise<CommentType[]> => {
    const comments = await getCommentsByDiaryModel(diaryId, page, limit); // pagination 적용
    return comments;
  };
  