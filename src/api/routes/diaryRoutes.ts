import { Router } from 'express';
import { 
    createDiaryController, 
    getAllDiaryController, 
    getMyDiaryController, 
    getOneDiaryController, 
    updateDiaryController, 
    deleteDiaryController 
} from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/', validateToken, createDiaryController);
router.get('/', validateToken, getAllDiaryController);
router.get('/:userId', validateToken, getMyDiaryController);
router.get('/:diaryId', validateToken, getOneDiaryController);
router.patch('/', validateToken, updateDiaryController);
router.delete('/:diaryId', validateToken, deleteDiaryController);

export default router;