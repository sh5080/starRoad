import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import { ensureAdmin } from '../middlewares/admin';
import {
  getAllUsersController,
  updateUserController,
  deleteUserController,
  getAllUserInfoTravelController,
  getUserInfoAllLocationController,
  getUserInfoAllDiaryController,
  getUserInfoAllCommentController,
  getUserAllCommentsController,
} from '../../controllers/adminController';
const router = Router();
// 관리자 페이지 구현

// [관리자] 모든 회원 조회하기
router.get('/users', validateToken, ensureAdmin, getAllUsersController);

// [관리자] 회원 정보 수정하기
router.patch('/users/:id', validateToken, ensureAdmin, updateUserController);

// [관리자] 회원 정보 삭제하기
router.delete('/users/:id', validateToken, ensureAdmin, deleteUserController);

// [관리자] 회원이 작성한 여행 일정 조회하기
router.get('/users/:user_id/plans', validateToken, ensureAdmin, getAllUserInfoTravelController);

// [관리자] 회원이 작성한 여행 일정의 모든 장소 조회하기
router.get('/users/:plan_id/locations', validateToken, ensureAdmin, getUserInfoAllLocationController);

// [관리자] 회원이 작성한 여행 일정의 모든 일기 조회하기
router.get('/users/:user_id/diary', validateToken, ensureAdmin, getUserInfoAllDiaryController);

// [관리자] 회원이 작성한 다이어리의 모든 댓글 조회하기
router.get('/users/:user_id/diary/:diary_id/comments', validateToken, ensureAdmin, getUserInfoAllCommentController);

// [관리자] 회원이 작성한 모든 댓글 조회하기
router.get('/users/:user_id/comments', validateToken, ensureAdmin, getUserAllCommentsController);

export default router;
