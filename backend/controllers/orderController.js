import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

/**
 * @desc    Get all orders for administration
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('products.productId', 'title price image')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: orders.length,
        orders
    });
});

/**
 * @desc    Update order details (status/payment)
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
export const updateOrder = asyncHandler(async (req, res) => {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status || order.status;
        order.paymentStatus = paymentStatus || order.paymentStatus;

        const updatedOrder = await order.save();
        res.json({
            success: true,
            order: updatedOrder,
            message: 'Order updated successfully'
        });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

/**
 * @desc    Place a new order (Used by customers)
 * @name    placeOrder
 */
export const placeOrder = asyncHandler(async (req, res) => {
    const { orderItems, totalAmount, paymentStatus } = req.body;
    const userId = req.auth.userId;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const order = new Order({
        userId,
        products: orderItems,
        totalAmount,
        paymentStatus: paymentStatus || 'pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// Alias for backwards compatibility if needed
export const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.auth ? req.auth.userId : req.query.userId;
    const orders = await Order.find({ userId })
        .populate('products.productId', 'title image')
        .sort({ createdAt: -1 });
    res.json(orders);
});
