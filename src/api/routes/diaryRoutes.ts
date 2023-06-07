import { Router } from 'express';
import * as diaryController from '../../controllers/diaryController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

router.get('/', diaryController.getAllDiariesController); //여행기 전체 조회
router.get('/:diary_id', diaryController.getOneDiaryController); //특정 여행기 조회


export default router;