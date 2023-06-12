import { Router } from 'express';
import * as userController from '../../controllers/userController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/', validateToken, userController.getUserInfo); //회원정보 조회
router.patch('/', validateToken, userController.updateUserInfo); //회원정보 수정
router.delete('/', validateToken, userController.deleteUserInfo); //회원 탈퇴

export default router;

