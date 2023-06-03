import { Router } from 'express';
import { createDiaryController,getAllDiaryController,getOneDiaryController, updateDiaryController } from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/', validateToken, createDiaryController);
router.get('/', validateToken, getAllDiaryController);
router.get('/:diaryId', validateToken, getOneDiaryController);
router.patch('/', validateToken, updateDiaryController);
// router.delete('/', validateToken, deleteDiaryController);

export default router;