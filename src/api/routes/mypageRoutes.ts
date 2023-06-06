import { Router } from 'express';
import { 
    getUserInfo, 
    updateUserInfo, 
    deleteUserInfo
} from '../../controllers/userController';
import { 
    createDiaryController,
    getMyDiaryController,
    updateDiaryController, 
    deleteDiaryController
} from '../../controllers/diaryController';

import { validateToken } from '../middlewares/jwt';

const router = Router();

router.get('/user', validateToken, getUserInfo);
router.patch('/user', validateToken, updateUserInfo);
router.delete('/user', validateToken, deleteUserInfo);

router.post('/diary', validateToken, createDiaryController); //여행기 생성
router.get('/diary', validateToken, getMyDiaryController); //나의 여행기 조회
router.patch('/diary/:diary_id', validateToken, updateDiaryController);
router.delete('/diary/:diary_id', validateToken, deleteDiaryController);
export default router;