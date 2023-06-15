import { Router } from 'express';
import * as userController from '../../controllers/userController';
import { validateRequestBody } from '../middlewares/validateRequestBody';

const router = Router();

/** [인증] 회원 가입 */
router.post('/signup', validateRequestBody(['name','username','password','email']),userController.signup);

/** [인증] 로그인 */
router.post('/login', validateRequestBody(['username','password']), userController.login);

/** [인증] 로그아웃 */
router.post('/logout', userController.logout);

export default router;
