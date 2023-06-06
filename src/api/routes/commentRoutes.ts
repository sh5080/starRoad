import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import { ensureAdmin } from '../middlewares/admin';
import {
    createCommentController,
    getCommentsByDiaryController,
    getAllCommentsController,
    updateCommentController,
    deleteCommentController,
  } from '../../controllers/commentController';


const router = Router();

router.post('/', validateToken, createCommentController);
router.get('/diary/:diary_id', validateToken, getCommentsByDiaryController); //여행기별 댓글 조회
router.get('/admin', validateToken, ensureAdmin, getAllCommentsController); //관리자 댓글 전체조회
router.patch('/:id', validateToken, updateCommentController); // comment의 id값 입력
router.delete('/:id', validateToken, deleteCommentController); // comment의 id값 입력

export default router;

