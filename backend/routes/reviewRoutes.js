import express from 'express';
import { submitReview, getProductReviews, checkCanReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, submitReview);

router.get('/:productId', getProductReviews);
router.get('/check/:productId', protect, checkCanReview);

export default router;
