import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Admin login for manual administration (non-Clerk)
 * @route   POST /api/admin/login
 * @access  Public
 */
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Static Admin Credentials - For manual dashboard access
    const ADMIN_EMAIL = "admin@collection.com";
    const ADMIN_PASSWORD = "admin123";

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Generate JWT Token
        const token = jwt.sign(
            { id: "admin_root", role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            email: ADMIN_EMAIL,
            token,
            role: "admin",
            message: "Login successful"
        });
    } else {
        res.status(401);
        throw new Error('Invalid Admin Credentials');
    }
});

export { adminLogin };
