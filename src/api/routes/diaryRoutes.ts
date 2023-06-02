import { Router } from 'express';
import { createDiaryController } from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/', validateToken, createDiaryController);
// router.get('/diary', validateToken, getDiaryInfo);
// router.patch('/diary', validateToken, updateDiaryInfo);
// router.delete('/diary', validateToken, deleteDiaryInfo);

export default router;