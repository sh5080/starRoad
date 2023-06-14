import { Router } from 'express';
import * as authController from '../../controllers/authController';
const router = Router();
router.get('/auth/kakao/callback', authController.kakaoCallback);
router.get('/auth/kakao/', authController.kakaoLogin);

router.get('/auth/google/callback', authController.googleCallback);
router.get('/auth/google', authController.googleLogin);

export default router;
