import { Router } from 'express';
import * as destinationController from '../../controllers/destinationController';

const router = Router();


router.get('/:location_id', destinationController.getTouristDestinationController); //관광지 상세조회
router.get('/', destinationController.getAllTouristDestinationController); //관광지 전체조회

export default router;
