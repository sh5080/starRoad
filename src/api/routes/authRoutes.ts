import { Router } from 'express';
import * as authController from '../../controllers/authController';

const router = Router();

/** [인증] 카카오 콜백 */
router.get('/kakao/callback', authController.kakaoCallback);

/** [인증] 카카오 로그인 */
// router.get('/kakao/', authController.kakaoLogin);

/** [인증] 구글 콜백 */
router.get('/google/callback', authController.googleCallback);

/** [인증] 구글 로그인 */
// router.get('/google', authController.googleLogin);

export default router;
