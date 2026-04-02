import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { getAllOrders, updateOrder } from '../controllers/orderController.js';
import { getUsers } from '../controllers/userController.js';
import { verifyAdminToken } from '../middlewares/adminMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin and return token
 * @access  Public
 */
router.post('/login', adminLogin);

/**
 * @desc    Protected Administration Routes
 * Uses manual verification rather than Clerk for the management dashboard
 */
router.use(verifyAdminToken); // Apply protection to all routes below this line

router.get('/orders', getAllOrders);
router.get('/users', getUsers);
router.put('/orders/:id', updateOrder);

export default router;
