import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private
export const submitReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment, userName } = req.body;
    const userId = req.auth.userId;

    // 1. Check if user has purchased this product
    const orders = await Order.find({
        userId: userId,
        status: 'delivered', 
        'products.productId': productId
    });

    if (orders.length === 0) {
        res.status(403);
        throw new Error('Only customers who purchased and received this product can leave a review');
    }

    // 2. Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this product');
    }

    const review = await Review.create({
        userId,
        userName: userName || 'Anonymous',
        productId,
        rating,
        comment,
    });

    // 3. Update Product average rating and numReviews
    const reviews = await Review.find({ productId });
    const numReviews = reviews.length;
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
        numReviews,
        averageRating,
        rating: averageRating // Keeping rating synced
    });

    res.status(201).json(review);
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
});

// @desc    Check if user can review a product
// @route   GET /api/reviews/check/:productId
// @access  Private
export const checkCanReview = asyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const productId = req.params.productId;

    const orders = await Order.find({
        userId: userId,
        status: 'delivered',
        'products.productId': productId
    });

    const existingReview = await Review.findOne({ userId, productId });

    res.json({
        canReview: orders.length > 0 && !existingReview,
        hasPurchased: orders.length > 0,
        alreadyReviewed: !!existingReview
    });
});
