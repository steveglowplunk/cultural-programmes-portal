import express from 'express';
import { createComment, getCommentsByLocation, deleteComment } from '../controllers/commentController';
import { asyncHandler } from '../controllers/asyncHandler';

const router = express.Router();

router.post('/comments', asyncHandler(createComment));
router.get('/comments/:locationId', asyncHandler(getCommentsByLocation));
router.delete('/comments/:commentId', asyncHandler(deleteComment));

export const setCommentRoutes = (app: express.Application) => {
    app.use('/api', router);
};