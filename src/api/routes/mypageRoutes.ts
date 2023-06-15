import { Router } from 'express';
import * as userController from '../../controllers/userController';
import * as diaryController from '../../controllers/diaryController';
import { processImage } from '../middlewares/multer';
import { validateToken } from '../middlewares/jwt';

const router = Router();

/** [다이어리] 여행기 작성 */
router.post('/diary/:planId', validateToken, processImage, diaryController.createDiary);

/** [다이어리] 나의 여행기 조회 */
router.get('/diary', validateToken, diaryController.getMyDiaries);

/** [사용자] 회원정보 조회 */
router.get('/', validateToken, userController.getUserInfo);

/** [다이어리] 다이어리 수정 */
router.put('/diary/:diaryId', validateToken, processImage, diaryController.updateDiary);

/** [사용자] 회원정보 수정 */
router.put('/', validateToken, userController.updateUserInfo);

/** [다이어리] 여행기 삭제 */
router.delete('/diary/:diaryId', validateToken, diaryController.deleteDiary);

/** [사용자] 회원 탈퇴 */
router.delete('/', validateToken, userController.deleteUserInfo);

export default router;
