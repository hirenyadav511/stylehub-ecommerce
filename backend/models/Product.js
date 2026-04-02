import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a product title'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        image: {
            type: String,
            required: [true, 'Please add an image URL'],
        },
        stock: {
            type: Number,
            required: [true, 'Please add stock count'],
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
