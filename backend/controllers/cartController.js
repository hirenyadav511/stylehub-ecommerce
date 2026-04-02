import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const userId = req.auth.userId;

    let cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
        // If no cart exists, return an empty one
        cart = await Cart.create({ userId, products: [] });
    }

    res.json(cart);
});

// @desc    Add or update item in cart (merge duplicates)
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        res.status(400);
        throw new Error('Please provide productId and quantity');
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        // Create new cart if doesn't exist
        cart = await Cart.create({
            userId,
            products: [{ productId, quantity: Number(quantity) }],
        });
    } else {
        // Check if product already exists in cart
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex > -1) {
            // Merge duplicate items (increase quantity)
            cart.products[productIndex].quantity += Number(quantity);
        } else {
            // Add as new item
            cart.products.push({ productId, quantity: Number(quantity) });
        }

        await cart.save();
    }

    const updatedCart = await Cart.findOne({ userId }).populate('products.productId');
    res.status(200).json(updatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });

    if (cart) {
        cart.products = cart.products.filter(
            (item) => item.productId.toString() !== productId
        );
        await cart.save();

        const updatedCart = await Cart.findOne({ userId }).populate('products.productId');
        res.json(updatedCart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

export { getCart, addToCart, removeFromCart };
