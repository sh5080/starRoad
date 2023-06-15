import { Router } from 'express';
import * as travelController from '../../controllers/travelController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

/** [여행 일정] 여행 일정 등록 */
router.post('/', validateToken, travelController.createTravelPlan);

/** [여행 일정] 여행 일정 상세 조회 */
router.get('/:planId', validateToken, travelController.getTravelPlanDetail);

/** [여행 일정] 여행 일정 조회 */
router.get('/', validateToken, travelController.getTravelPlans);

/** [여행 일정] 여행 일정 수정 */
router.put('/:planId', validateToken, travelController.updateTravelPlanAndLocation);

/** [여행 일정] 여행 일정 삭제 */
router.delete('/:planId', validateToken, travelController.deleteTravelPlan);

export default router;
