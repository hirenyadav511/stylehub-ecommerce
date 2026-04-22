import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, minOrderAmount, expiryDate, usageLimit } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount,
        expiryDate,
        usageLimit,
    });

    if (coupon) {
        res.status(201).json(coupon);
    } else {
        res.status(400);
        throw new Error('Invalid coupon data');
    }
});

/**
 * @desc    Apply a coupon to the cart
 * @route   POST /api/coupons/apply
 * @access  Private
 */
const applyCoupon = asyncHandler(async (req, res) => {
    const { code, cartTotal } = req.body;
    
    // 1. Validate Input
    const subtotal = Number(cartTotal);
    if (!cartTotal || isNaN(subtotal)) {
        res.status(400);
        throw new Error('Please provide a valid cart subtotal');
    }

    // 2. Fetch Coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    // 3. Validation Logic
    if (!coupon) {
        res.status(400); // User requested 400
        throw new Error('Invalid coupon');
    }

    // 5. Debug Logging (Added before other validations)
    console.log("Subtotal:", subtotal);
    console.log("Min Amount:", coupon.minOrderAmount);

    if (!coupon.isActive) {
        res.status(400);
        throw new Error('This coupon is no longer active');
    }

    // Expiry check
    if (new Date(coupon.expiryDate) < new Date()) {
        res.status(400);
        throw new Error('Coupon expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        res.status(400);
        throw new Error('Coupon usage limit reached');
    }

    // 4. Strict Check for Minimum Order
    if (subtotal < Number(coupon.minOrderAmount)) {
        res.status(400);
        throw new Error(`Minimum order should be ₹${coupon.minOrderAmount}`);
    }

    // 6. Calculate Discount Amount
    let calculatedDiscount = 0;
    const sub = Number(subtotal);
    const discValue = Number(coupon.discountValue);

    if (coupon.discountType === 'percentage') {
        calculatedDiscount = (sub * discValue) / 100;
    } else {
        calculatedDiscount = discValue;
    }

    // 2. Prevent Over-Discount & 8. Edge Cases
    // Ensure discount never exceeds subtotal
    calculatedDiscount = Math.min(calculatedDiscount, sub);

    // 7. Debug Logging
    console.log("Subtotal:", sub);
    console.log("Discount:", calculatedDiscount);

    // 4. Frontend Total Calculation Readiness
    const finalTotal = sub - calculatedDiscount;

    res.json({
        success: true,
        code: coupon.code,
        discount: calculatedDiscount, // Return only valid discount amount
        finalTotal: finalTotal >= 0 ? finalTotal : 0, // Ensure total >= 0
        minOrderAmount: coupon.minOrderAmount
    });
});

/**
 * @desc    Get all coupons (Admin Only)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
});

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

export {
    createCoupon,
    applyCoupon,
    getCoupons,
    deleteCoupon,
};
