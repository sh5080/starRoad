import { Router } from 'express';
import * as diaryController from '../../controllers/diaryController';
import { processImage } from '../middlewares/multer';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.post('/diary', validateToken, processImage, diaryController.createDiaryController); //여행기 작성
router.get('/', validateToken, diaryController.getMyDiaries); //나의 여행기 조회
router.patch('/diary/:diary_id', validateToken, diaryController.updateDiary);
router.delete('/diary/:diary_id', validateToken, diaryController.deleteDiary);



export default router;