import { Router } from 'express';
import * as userController from '../../controllers/userController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', validateToken ,userController.logout);

router.get('/', validateToken, userController.getUserInfo); //회원정보 조회
router.patch('/', validateToken, userController.updateUserInfo); //회원정보 수정
router.delete('/', validateToken, userController.deleteUserInfo); //회원 탈퇴

export default router;

// isAccessTokenValid 미들웨어

// 최초 로그인 이후 모든 요청에 대해 토큰 유효성 검사 진행 ( 비회원들은? uuid로 해야 하나?, 아니면 일정짜기, 게시글작성에 대해서만? )
