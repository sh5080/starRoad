import { Request, Response } from 'express';
import { 
    createComment,
    getCommentsByDiary,

} from '../services/commentService';
import { getOneDiary } from '../services/diaryService';
import { AppError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload & { userId: string };
}

export const createCommentController = async (req: CustomRequest, res: Response) => {
  try {
    const { diaryId, comment } = req.body;

    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId) {
      throw new AppError('로그인이 필요합니다.', 401);
    }

    const diary = await getOneDiary(diaryId);
    if (!diary) {
      return res.status(401).json({ error: '유효하지 않은 여행기입니다.' });
    }

    const createdCommentId = await createComment({ userId: loggedInUserId, diaryId, comment });

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
        const { diaryId } = req.params;
        const { page, limit } = req.query; // 변경된 부분
        
        console.log(req.query);
      const loggedInUserId = req.user?.userId;
    
      if (!loggedInUserId) {
        throw new AppError('로그인이 필요합니다.', 401);
      }
    
      const comments = await getCommentsByDiary(Number(diaryId), Number(page), Number(limit)); // pagination 적용
    
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
  