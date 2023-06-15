import { Router } from 'express';
import * as destinationController from '../../controllers/destinationController';

const router = Router();

/** [관광지] 관광지 상세조회 */
router.get('/:location_id', destinationController.getTouristDestination);

/** [관광지] 관광지 전체조회 */
router.get('/', destinationController.getAllTouristDestination);

export default router;
