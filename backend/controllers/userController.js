import asyncHandler from 'express-async-handler';
import { clerkClient } from '@clerk/clerk-sdk-node';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    try {
        // List all users from Clerk
        const usersList = await clerkClient.users.getUserList();
        
        // Simplify user data for frontend
        const users = usersList.data.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress,
            role: user.publicMetadata.role || 'user',
            createdAt: user.createdAt,
        }));

        res.json(users);
    } catch (error) {
        console.warn('Clerk SDK Error (Using Mock Users):', error.message);
        // Fallback to a mock admin user if Clerk fails (e.g., missing API key)
        const mockUsers = [
            {
                id: 'admin_123',
                firstName: 'Demo',
                lastName: 'Admin',
                email: 'admin@gmail.com',
                role: 'admin',
                createdAt: new Date(),
            }
        ];
        res.json(mockUsers);
    }
});

export { getUsers };
