import { Router } from 'express';
import { signup, login, getUserinfo } from '../../controllers/userController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/mypage/:userId',getUserinfo);

export default router;
