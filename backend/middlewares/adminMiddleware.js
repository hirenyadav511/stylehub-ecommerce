import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Middleware to verify manual admin JWT token (non-Clerk)
 * @name    verifyAdminToken
 */
export const verifyAdminToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    // Check for authorization header presence and format
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        try {
            // Extract the token
            token = authHeader.split(' ')[1];

            // Verify using the JWT_SECRET from environment
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error('❌ CRITICAL ERROR: JWT_SECRET is not defined in environment');
                res.status(500);
                throw new Error('Server authentication configuration error');
            }

            const decoded = jwt.verify(token, secret);

            // Re-validate the role specifically for admin dashboard protection
            if (decoded.role !== 'admin') {
                res.status(403);
                throw new Error('Access denied: You are not an admin');
            }

            // Attach admin identification to the request object
            req.adminUser = {
                id: decoded.id,
                role: decoded.role
            };

            next();
        } catch (error) {
            console.error('⚠️ Admin JWT verification failed:', error.message);
            res.status(401);
            throw new Error('Not authorized, token validation failed');
        }
    } else {
        res.status(401);
        throw new Error('Authentication required, no token provided');
    }
});
