import { Router } from 'express';
import { createTravelPlanController, getTravelPlanController } from '../../controllers/travelController';
import { validateToken } from '../middlewares/jwt';

const router = Router();

// 여행 일정 등록
router.post('/', validateToken, createTravelPlanController);

// 여행 일정 조회
router.get('/', validateToken, getTravelPlanController);

export default router;

// GET /travelPlans : 모든 여행일정을 조회합니다.
// POST /travelPlans : 새로운 여행일정을 생성합니다. @@@@@
// GET /travelPlans/:planId : 특정 여행일정을 조회합니다.
// PUT /travelPlans/:planId : 특정 여행일정을 수정합니다.
// DELETE /travelPlans/:planId : 특정 여행일정을 삭제합니다.
// GET /travelPlans/:planId/locations : 특정 여행일정의 모든 장소를 조회합니다.
// POST /travelPlans/:planId/locations : 특정 여행일정에 새로운 장소를 추가합니다.
