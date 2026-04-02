import express from 'express';
import {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrder,
} from '../controllers/orderController.js';
import { verifyAdminToken } from '../middlewares/adminMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin Management Routes
router.route('/')
    .get(verifyAdminToken, getAllOrders);

router.route('/:id')
    .put(verifyAdminToken, updateOrder);

// Customer Routes (Shared)
router.post('/place', protect, placeOrder);
router.get('/my', protect, getMyOrders);

export default router;
