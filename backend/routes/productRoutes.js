import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
} from '../controllers/productController.js';
import { verifyAdminToken } from '../middlewares/adminMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected User Routes
router.post('/:id/review', protect, createProductReview);

// Admin-only Routes
router.post('/', verifyAdminToken, createProduct);
router.put('/:id', verifyAdminToken, updateProduct);
router.delete('/:id', verifyAdminToken, deleteProduct);

export default router;
