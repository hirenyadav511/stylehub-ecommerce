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
            enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        },
        paymentStatus: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'paid', 'failed'],
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
