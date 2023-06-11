import { Router } from 'express';
import * as diaryController from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';
import { processImage } from '../middlewares/multer';
const router = Router();

router.get('/', diaryController.getAllDiaries); //여행기 전체 조회
router.get('/:diary_id', diaryController.getOneDiary); //특정 여행기 조회

router.post('/mypage/diary', validateToken, processImage, diaryController.createDiaryController); //여행기 작성
router.get('/mypage/diary', validateToken, diaryController.getMyDiaries); //나의 여행기 조회
router.patch('/mypage/diary/:diary_id', validateToken, diaryController.updateDiary);
router.delete('/mypage/diary/:diary_id', validateToken, diaryController.deleteDiary);

export default router;
