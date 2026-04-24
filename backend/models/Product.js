import mongoose from 'mongoose';

const variantSchema = mongoose.Schema({
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    }
});

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0,
        },
        brand: {
            type: String,
            required: [true, 'Please add a brand'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['T-Shirts', 'Shirts', 'Jeans', 'Hoodies', 'Jackets', 'Accessories', 'Shoes'],
        },
        material: {
            type: String,
            required: [true, 'Please add material details'],
        },
        images: [
            {
                type: String,
                required: [true, 'Please add at least one image URL'],
            }
        ],
        variants: [variantSchema],
        
        // Social Features (maintained from previous iteration)
        reviews: [
            {
                userId: { type: String, required: true },
                username: { type: String, required: true },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String, required: true },
                fit: { type: String, enum: ['Perfect', 'Loose', 'Tight'], default: 'Perfect' },
                createdAt: { type: Date, default: Date.now },
            }
        ],
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        averageRating: {
            type: Number,
            required: true,
            default: 0,
        },
        rating: { // Synced with averageRating for filtering efficiency
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Optimized Indexes
productSchema.index({ name: 'text', brand: 'text' }); // Broad search for name and brand
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
