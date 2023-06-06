import { Router } from 'express';
import { 

    getMyDiaryController, 

} from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();


router.get('/diary', validateToken, getMyDiaryController); //나의 여행기 조회


export default router;