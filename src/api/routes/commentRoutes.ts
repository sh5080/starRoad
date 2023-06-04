import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import {
    createCommentController,
    getCommentsByDiaryController,
    // updateCommentController,
    // deleteCommentController,
  } from '../../controllers/commentController';


const router = Router();

router.post('/', validateToken, createCommentController);
router.get('/:diaryId', validateToken, getCommentsByDiaryController); //여행기별 댓글 조회
// router.get('/', validateToken, getCommentsController); //관리자 댓글 전체조회
// router.patch('/comments/:commentId', validateToken, updateCommentController);
// router.delete('/comments/:commentId', validateToken, deleteCommentController);

export default router;