import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: String, // Clerk userId or manual userId
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: { type: String, required: true },
                image: { type: String, required: true },
                size: { type: String, required: true },
                color: { type: String, required: true },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
        },
        paymentStatus: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'paid', 'failed'],
        },
        couponCode: {
            type: String,
            uppercase: true,
        },
        discountAmount: {
            type: Number,
            default: 0.0,
        },
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            phone: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'stripe',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
