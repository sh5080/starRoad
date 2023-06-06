import { Router } from 'express';
import { 
    getUserInfo, 
    updateUserInfo, 
    deleteUserInfo
} from '../../controllers/userController';
import { getMyDiaryController } from '../../controllers/diaryController';

import { validateToken } from '../middlewares/jwt';

const router = Router();

router.get('/', validateToken, getUserInfo);
router.patch('/', validateToken, updateUserInfo);
router.delete('/', validateToken, deleteUserInfo);
router.get('/diary', validateToken, getMyDiaryController); //나의 여행기 조회


export default router;