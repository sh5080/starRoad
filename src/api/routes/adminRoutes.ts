import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import { ensureAdmin } from '../middlewares/admin';
import { getAllUsersController, updateUserController, deleteUserController } from '../../controllers/adminController';
const router = Router();
// 관리자 페이지 구현

router.get('/users', validateToken, ensureAdmin, getAllUsersController);
router.patch('/users/:id', validateToken, ensureAdmin, updateUserController);
router.delete('/users/:id', validateToken, ensureAdmin, deleteUserController);
export default router;
