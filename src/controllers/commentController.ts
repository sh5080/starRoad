import { Request, Response } from 'express';
import { 
    createComment,
    getCommentsByDiary,
    getAllComments

} from '../services/commentService';
import { getOneDiary } from '../services/diaryService';
import { AppError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string };
}

export const createCommentController = async (req: CustomRequest, res: Response) => {
  try {
    const { diary_id, comment } = req.body;

    const loggedInUserId = req.user?.user_id;

    if (!loggedInUserId) {
      throw new AppError('로그인이 필요합니다.', 401);
    }

    const diary = await getOneDiary(diary_id);
    if (!diary) {
      return res.status(401).json({ error: '유효하지 않은 여행기입니다.' });
    }

    const createdCommentId = await createComment({ user_id: loggedInUserId, diary_id, comment });

    res.status(201).json({ commentId: createdCommentId, message: '댓글이 생성되었습니다.' });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: '댓글 생성에 실패했습니다.' });
    }
  }
};
export const getCommentsByDiaryController = async (req: CustomRequest, res: Response) => {
    try {
        const { diary_id } = req.params;
        const { page, limit } = req.query; // 변경된 부분
        
        //console.log(req.query);
      const loggedInUserId = req.user?.user_id;
    
      if (!loggedInUserId) {
        throw new AppError('로그인이 필요합니다.', 401);
      }
    
      const comments = await getCommentsByDiary(Number(diary_id), Number(page), Number(limit));
    
      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
    
      if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).json({ error: '댓글 조회에 실패했습니다.' });
      }
    }
  };
  export const getAllCommentsController = async (req: CustomRequest, res: Response) => {
    try {
      const comments = await getAllComments();
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '댓글 조회에 실패했습니다.' });
    }
  };