import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import { validateRequestBody } from '../middlewares/validateRequest';
import { ensureAdmin } from '../middlewares/admin';
import * as adminController from '../../controllers/adminController';
import { processImage } from '../middlewares/multer';
const router = Router();

/** [관리자] 회원이 작성한 여행 일정의 모든 장소 조회하기 */
router.get('/users/:planId/locations', validateToken, ensureAdmin, adminController.getAllLocationsByPlanId);

/** [관리자] 회원이 작성한 댓글 삭제하기 */
router.delete(
  '/users/:username/diaries/:diaryId/comments/:commentId',
  validateToken,
  ensureAdmin,
  adminController.deleteCommentByUsernameAndDiaryId
);

/** [관리자] 여행기의 모든 댓글 조회하기 */
router.get(
  '/users/:username/diaries/:diaryId/comments',
  validateToken,
  ensureAdmin,
  adminController.getAllCommentsByUsernameAndDiaryId
);

/** [관리자] 회원이 작성한 여행기 삭제하기 */
router.delete('/users/diaries/:diaryId', validateToken, ensureAdmin, adminController.deleteDiaryByUsernameAndDiaryId);

/** [관리자] 회원이 작성한 여행 일정 조회하기 */
router.get('/users/:username/plans', validateToken, ensureAdmin, adminController.getAllTravelPlansByUsername);

/** [관리자] 회원이 작성한 여행 일정의 모든 여행기 조회하기 */
router.get('/users/diaries/:username', validateToken, ensureAdmin, adminController.getAllDiariesByUsername);

/** [관리자] 특정 회원이 작성한 모든 댓글 조회하기 */
router.get('/users/:username/comments', validateToken, ensureAdmin, adminController.getAllCommentsByUsername);

/** [관리자] 회원 정보 수정하기 */
router.put(
  '/users/:id',
  validateToken,
  ensureAdmin,
  validateRequestBody(['username', 'name', 'email', 'role']),
  adminController.updateUser
);

/** [관리자] 회원 정보 삭제하기 */
router.delete('/users/:id', validateToken, ensureAdmin, adminController.deleteUser);

/** [관리자] 모든 회원 조회하기 */
router.get('/users', validateToken, ensureAdmin, adminController.getAllUsers);

/** [관리자] 특정 회원 정보 조회하기 */
router.get('/users/:id', validateToken, ensureAdmin, adminController.getUser);

/** [관리자] 관광지 추가하기 */
router.post(
  '/locations',
  validateToken,
  ensureAdmin,
  processImage,
  validateRequestBody(['nameEn', 'nameKo', 'introduction', 'latitude', 'longitude']),
  adminController.addTouristDestination
);

/** [관리자] 관광지 수정하기 */
router.put(
  '/locations/:locationId',
  validateToken,
  ensureAdmin,
  validateRequestBody(['nameEn', 'nameKo', 'image', 'introduction']),
  adminController.updateTouristDestination
);

/** [관리자] 관광지 삭제하기 */
router.delete('/locations/:locationId', validateToken, ensureAdmin, adminController.deleteTouristDestination);

export default router;
