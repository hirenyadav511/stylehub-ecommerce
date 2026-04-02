import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const userId = req.auth.userId;

    let wishlist = await Wishlist.findOne({ userId }).populate('products.productId');

    if (!wishlist) {
        wishlist = await Wishlist.create({ userId, products: [] });
    }

    res.json(wishlist);
});

// @desc    Toggle item in wishlist (add or remove)
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const { productId } = req.body;

    if (!productId) {
        res.status(400);
        throw new Error('Please provide productId');
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            userId,
            products: [{ productId }],
        });
        res.status(201).json({ message: 'Added to wishlist' });
    } else {
        const productIndex = wishlist.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex > -1) {
            // Remove if exists
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            res.status(200).json({ message: 'Removed from wishlist' });
        } else {
            // Add if doesn't exist
            wishlist.products.push({ productId });
            await wishlist.save();
            res.status(201).json({ message: 'Added to wishlist' });
        }
    }
});

export { getWishlist, toggleWishlist };
