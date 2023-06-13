import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import { ensureAdmin } from '../middlewares/admin';
import * as adminController from '../../controllers/adminController';
import { processImage } from '../middlewares/multer';
const router = Router();

// [관리자] 회원이 작성한 여행 일정의 모든 장소 조회하기
router.get('/users/:plan_id/locations', validateToken, ensureAdmin, adminController.getUserInfoAllLocationController);

// [관리자] 회원이 작성한 댓글 삭제하기
router.delete(
  '/users/:username/:diary_id/:comment_id/comments',
  validateToken,
  ensureAdmin,
  adminController.deleteCommentByAdminController
);

// [관리자] 회원이 작성한 다이어리의 모든 댓글 조회하기
router.get(
  '/users/:username/diary/:diary_id/comments',
  validateToken,
  ensureAdmin,
  adminController.getUserInfoAllCommentController
);

// [관리자] 회원이 작성한 다이어리 삭제하기
router.delete(
  '/users/:username/:diary_id/diary',
  validateToken,
  ensureAdmin,
  adminController.deleteDiaryByAdminController
);

// [관리자] 회원이 작성한 여행 일정 조회하기
router.get('/users/:username/plans', validateToken, ensureAdmin, adminController.getAllUserInfoTravelController);

// [관리자] 회원이 작성한 여행 일정의 모든 일기 조회하기
router.get('/users/:username/diary', validateToken, ensureAdmin, adminController.getUserInfoAllDiaryController);

// [관리자] 회원이 작성한 모든 댓글 조회하기
router.get('/users/:username/comments', validateToken, ensureAdmin, adminController.getUserAllCommentsController);

// [관리자] 회원 정보 수정하기
router.patch('/users/:id', validateToken, ensureAdmin, adminController.updateUserController);

// [관리자] 회원 정보 삭제하기
router.delete('/users/:id', validateToken, ensureAdmin, adminController.deleteUserController);

// [관리자] 모든 회원 조회하기
router.get('/users', validateToken, ensureAdmin, adminController.getAllUsersController);

// [관리자] 관광지 추가하기
router.post('/locations', validateToken, ensureAdmin, processImage, adminController.addTouristDestinationController);

// [관리자] 관광지 수정하기
router.patch('/locations/:location_id', validateToken, ensureAdmin, adminController.updateTouristDestinationController);

// [관리자] 관광지 삭제하기
router.delete(
  '/locations/:location_id',
  validateToken,
  ensureAdmin,
  adminController.deleteTouristDestinationController
);

export default router;
