import { Router } from 'express';
import * as userController from '../../controllers/userController';
import * as diaryController from '../../controllers/diaryController';

import { validateToken } from '../middlewares/jwt';

const router = Router();

router.get('/user', validateToken, userController.getUserInfo);
router.patch('/user', validateToken, userController.updateUserInfo);
router.delete('/user', validateToken, userController.deleteUserInfo);

router.post('/diary', validateToken, diaryController.createDiaryController); //여행기 생성
router.get('/diary', validateToken, diaryController.getMyDiariesController); //나의 여행기 조회
router.patch('/diary/:diary_id', validateToken, diaryController.updateDiaryController);
router.delete('/diary/:diary_id', validateToken, diaryController.deleteDiaryController);
export default router;