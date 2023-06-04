import { 
    createCommentModel,
    getCommentsByDiaryModel,
    getAllCommentsModel

} from '../models/commentModel';

import { CommentType } from '../types/comment';
import { AppError } from '../api/middlewares/errorHandler';

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