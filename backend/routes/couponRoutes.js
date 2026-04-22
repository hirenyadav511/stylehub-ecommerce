import express from 'express';
import {
    createCoupon,
    applyCoupon,
    getCoupons,
    deleteCoupon,
} from '../controllers/couponController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { verifyAdminToken } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public/User Routes
router.post('/apply', protect, applyCoupon);

// Admin Routes (Supports both Clerk Admin and Manual JWT Admin)
router.route('/')
    .get(verifyAdminToken, getCoupons) // For manual admin panel
    .post(verifyAdminToken, createCoupon);

router.route('/:id')
    .delete(verifyAdminToken, deleteCoupon);

// Admin Routes for Clerk users if needed
router.get('/admin', protect, admin, getCoupons);

export default router;
