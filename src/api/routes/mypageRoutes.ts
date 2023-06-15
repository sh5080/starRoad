import { Router } from 'express';
import * as userController from '../../controllers/userController';
import * as diaryController from '../../controllers/diaryController';
import { processImage } from '../middlewares/multer';
import { validateToken } from '../middlewares/jwt';
import { validateRequestBody } from '../middlewares/validateRequestBody';

const router = Router();

/** [다이어리] 여행기 작성 */
router.post('/diaries/:planId', validateToken, processImage, validateRequestBody(['title', 'content']),diaryController.createDiary);

/** [다이어리] 여행기 조회 */
router.get('/diaries', validateToken, diaryController.getMyDiaries);

/** [사용자] 회원정보 조회 */
router.get('/', validateToken, userController.getUserInfo);

/** [다이어리] 여행기 수정 */
router.put('/diaries/:diaryId', validateToken, processImage, diaryController.updateDiary);

/** [사용자] 회원정보 수정 */
router.put('/', validateToken, userController.updateUserInfo);

/** [다이어리] 여행기 삭제 */
router.delete('/diaries/:diaryId', validateToken, diaryController.deleteDiary);

/** [사용자] 회원 탈퇴 */
router.delete('/', validateToken, userController.deleteUserInfo);

export default router;
