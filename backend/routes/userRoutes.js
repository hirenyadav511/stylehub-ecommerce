import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getUsers); // Admin only

export default router;
