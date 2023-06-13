import { Router } from 'express';
import * as authController from '../../controllers/authController';
const router = Router();

router.get('/auth/kakao/', authController.kakaoLogin);
router.get('/auth/kakao/callback', authController.kakaoLogin);

router.get('/auth/google', authController.googleLogin);
router.get('/auth/google/callback', authController.googleCallback);


export default router;

