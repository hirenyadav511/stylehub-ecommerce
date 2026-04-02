import { clerkClient } from '@clerk/clerk-sdk-node';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

// Protect routes middleware
export const protect = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // First try Clerk verification
            const sessionClaims = await clerkClient.verifyToken(token);
            req.auth = {
                userId: sessionClaims.sub,
                isAdmin: sessionClaims.publicMetadata?.role === 'admin'
            };
        } catch (clerkError) {
            console.error("Clerk Token Verification Failed:", clerkError);
            // If Clerk fails, try manual JWT verification
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.auth = {
                    userId: decoded.id,
                    isAdmin: decoded.role === 'admin'
                };
            } catch (jwtError) {
                console.error("Manual JWT Verification Failed:", jwtError);
                res.status(401);
                throw new Error('Not authorized, token failed');
            }
        }
        
        next();
    } catch (error) {
        res.status(401);
        throw new Error(`Not authorized, error: ${error.message}`);
    }
});

// Admin-only middleware
export const admin = asyncHandler(async (req, res, next) => {
    if (req.auth && req.auth.isAdmin) {
        next();
    } else {
        // Fallback: check Clerk metadata directly if not already set
        try {
            const user = await clerkClient.users.getUser(req.auth.userId);
            if (user && user.publicMetadata.role === 'admin') {
                next();
            } else {
                res.status(403);
                throw new Error('Not authorized as an admin');
            }
        } catch (error) {
            res.status(403);
            throw new Error('Not authorized as an admin');
        }
    }
});
