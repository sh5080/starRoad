import { Router } from 'express';
import * as diaryController from '../../controllers/diaryController';


const router = Router();

router.get('/', diaryController.getAllDiaries); //여행기 전체 조회
router.get('/:diary_id', diaryController.getOneDiary); //특정 여행기 조회

export default router;
