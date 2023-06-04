import { Router } from 'express';
import { validateToken } from '../middlewares/jwt';
import {
    createCommentController,
    // getCommentByIdController,
    // updateCommentController,
    // deleteCommentController,
  } from '../../controllers/commentController';


const router = Router();

router.post('/', validateToken, createCommentController);
// router.get('/comments/:commentId', getCommentByIdController);
// router.patch('/comments/:commentId', updateCommentController);
// router.delete('/comments/:commentId', deleteCommentController);

export default router;