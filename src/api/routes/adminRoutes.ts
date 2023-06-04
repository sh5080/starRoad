import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import { ensureAdmin } from '../middlewares/admin';

const router = Router();
// 관리자 페이지 구현

router.get('/', validateToken, ensureAdmin);

export default router;
