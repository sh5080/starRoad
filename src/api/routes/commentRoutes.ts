import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import * as commentController from '../../controllers/commentController';

const router = Router();

router.post('/', validateToken, commentController.createComment);
router.get('/diary/:diary_id', commentController.getCommentsByDiary); //여행기별 댓글 조회
router.put('/:comment_id', validateToken, commentController.updateComment); // comment의 id값 입력
router.delete('/:comment_id', validateToken, commentController.deleteComment); // comment의 id값 입력

export default router;
