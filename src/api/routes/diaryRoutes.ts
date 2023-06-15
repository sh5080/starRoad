import { Router } from 'express';
import * as diaryController from '../../controllers/diaryController';

const router = Router();

/** [여행기] 특정 여행기 조회 */
router.get('/:diaryId', diaryController.getOneDiary);

/** [여행기] 여행기 전체 조회 */
router.get('/', diaryController.getAllDiaries);

export default router;
