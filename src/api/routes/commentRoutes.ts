import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import { ensureAdmin } from '../middlewares/admin';
import * as commentController from '../../controllers/commentController';


const router = Router();

router.post('/', validateToken, commentController.createCommentController);
router.get('/diary/:diary_id', commentController.getCommentsByDiaryController); //여행기별 댓글 조회
router.get('/admin', validateToken, ensureAdmin, commentController.getAllCommentsController); //관리자 댓글 전체조회
router.patch('/:comment_id', validateToken, commentController.updateCommentController); // comment의 id값 입력
router.delete('/:comment_id', validateToken, commentController.deleteCommentController); // comment의 id값 입력

export default router;

