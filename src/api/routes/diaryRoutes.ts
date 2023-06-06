import { Router } from 'express';
import { 
    createDiaryController, 
    getAllDiaryController, 
    getOneDiaryController, 
    updateDiaryController, 
    deleteDiaryController 
} from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/', validateToken, createDiaryController); //여행기 생성
router.get('/', getAllDiaryController); //여행기 전체 조회
router.get('/:diary_id', validateToken, getOneDiaryController); //특정 여행기 조회
router.patch('/', validateToken, updateDiaryController);
router.delete('/:diary_id', validateToken, deleteDiaryController);

export default router;