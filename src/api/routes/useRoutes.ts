import { Router } from 'express';
import { signup, login, getUserinfo } from '../../controllers/userController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/mypage/:userId', validateToken, getUserinfo);

export default router;

// isAccessTokenValid 미들웨어

// 최초 로그인 이후 모든 요청에 대해 토큰 유효성 검사 진행 ( 비회원들은? uuid로 해야 하나?, 아니면 일정짜기, 게시글작성에 대해서만? )
