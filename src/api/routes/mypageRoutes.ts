import { Router } from 'express';
import * as userController from '../../controllers/userController';
import * as diaryController from '../../controllers/diaryController';
import { processImage } from '../middlewares/multer';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/diary/:plan_id', validateToken, processImage, diaryController.createDiary); //여행기 작성

router.get('/diary', validateToken, diaryController.getMyDiaries); //나의 여행기 조회
router.get('/', validateToken, userController.getUserInfo); //회원정보 조회

router.put('/diary/:diary_id', validateToken, diaryController.updateDiary); // 다이어리 수정
router.put('/', validateToken, userController.updateUserInfo); //회원정보 수정



router.delete('/diary/:diary_id', validateToken, diaryController.deleteDiary); // 여행기 삭제


router.delete('/', validateToken, userController.deleteUserInfo); //회원 탈퇴

export default router;
