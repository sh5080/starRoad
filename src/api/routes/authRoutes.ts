import { Router } from 'express';
import * as authController from '../../controllers/authController';

const router = Router();

/** [인증] 카카오 콜백 */
router.get('/kakao/callback', authController.kakaoCallback);

/** [인증] 구글 콜백 */
router.get('/google/callback', authController.googleCallback);

export default router;
