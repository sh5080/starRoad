import { Router } from 'express';
import { 
    getAllDiariesController, 
    getOneDiaryController, 

} from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.get('/', getAllDiariesController); //여행기 전체 조회
router.get('/:diary_id', getOneDiaryController); //특정 여행기 조회


export default router;