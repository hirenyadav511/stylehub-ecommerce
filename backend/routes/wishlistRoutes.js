import express from 'express';
import {
    getWishlist,
    toggleWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getWishlist);

router.route('/toggle')
    .post(protect, toggleWishlist);

export default router;
