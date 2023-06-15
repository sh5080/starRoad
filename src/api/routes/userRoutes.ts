import { Router } from 'express';
import * as userController from '../../controllers/userController';

const router = Router();

/** [인증] 회원 가입 */
router.post('/signup', userController.signup);

/** [인증] 로그인 */
router.post('/login', userController.login);

/** [인증] 로그아웃 */
router.post('/logout', userController.logout);

export default router;
