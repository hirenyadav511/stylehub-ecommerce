import express from 'express';

const router = express.Router();

// @desc    Health check route
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'Server is healthy',
    });
});

export default router;
