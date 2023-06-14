import { Router } from 'express';
import * as destinationController from '../../controllers/destinationController';

const router = Router();


router.get('/:location_id', destinationController.getTouristDestination); //관광지 상세조회
router.get('/', destinationController.getAllTouristDestination); //관광지 전체조회

export default router;
