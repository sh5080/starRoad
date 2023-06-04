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
router.get('/:user_id', validateToken, getMyDiaryController);
router.get('/:diary_id', validateToken, getOneDiaryController);
router.patch('/', validateToken, updateDiaryController);
router.delete('/:diary_id', validateToken, deleteDiaryController);

export default router;