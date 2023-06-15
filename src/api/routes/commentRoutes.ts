import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import * as commentController from '../../controllers/commentController';

const router = Router();

/** [댓글] 댓글 생성 */
router.post('/', validateToken, commentController.createComment);

/** [댓글] 여행기별 댓글 조회 */
router.get('/diary/:diaryId', commentController.getCommentsByDiary); 

/** [댓글] 댓글 수정 */
router.put('/:commentId', validateToken, commentController.updateComment); 

/** [댓글] 댓글 삭제 */
router.delete('/:commentId', validateToken, commentController.deleteComment);

export default router;
