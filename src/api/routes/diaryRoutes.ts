import { Router } from 'express';
import * as diaryController from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.get('/', diaryController.getAllDiariesController); //여행기 전체 조회
router.get('/:diary_id', diaryController.getOneDiaryController); //특정 여행기 조회

router.post('/mypage/diary', validateToken, diaryController.createDiaryController); //여행기 작성
router.get('/mypage/diary', validateToken, diaryController.getMyDiariesController); //나의 여행기 조회
router.patch('/mypage/diary/:diary_id', validateToken, diaryController.updateDiaryController);
router.delete('/mypage/diary/:diary_id', validateToken, diaryController.deleteDiaryController);

export default router;