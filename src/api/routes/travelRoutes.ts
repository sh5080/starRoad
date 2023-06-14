import { Router } from 'express';
import * as travelController from '../../controllers/travelController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

// 여행 일정 등록
router.post('/', validateToken, travelController.createTravelPlan);

// 여행 일정 상세 조회
router.get('/:plan_id', validateToken, travelController.getTravelPlanDetail);
// 여행 일정 조회
router.get('/', validateToken, travelController.getTravelPlan);

// 여행 일정 수정
router.put('/:plan_id', validateToken, travelController.updateTravelPlanAndLocation);

// 특정 날짜 장소 수정
// router.patch('/location/:plan_id/:location_id', validateToken, travelController.updateTravelLocationController);

// 여행 일정 삭제
router.delete('/:plan_id', validateToken, travelController.deleteTravelPlan);

// 특정 날짜 장소 삭제
// router.delete('/location/:plan_id/:location_id', validateToken, travelController.deleteTravelLocationController);

export default router;
