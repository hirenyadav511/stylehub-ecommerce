import mongoose from 'mongoose';

const couponSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Please add a coupon code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            required: [true, 'Please specify discount type (percentage/fixed)'],
            enum: ['percentage', 'fixed'],
        },
        discountValue: {
            type: Number,
            required: [true, 'Please add a discount value'],
            default: 0,
        },
        minOrderAmount: {
            type: Number,
            required: [true, 'Please add a minimum order amount'],
            default: 0,
        },
        expiryDate: {
            type: Date,
            required: [true, 'Please add an expiry date'],
        },
        usageLimit: {
            type: Number,
            required: [true, 'Please add a usage limit'],
            default: 100,
        },
        usedCount: {
            type: Number,
            required: true,
            default: 0,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
