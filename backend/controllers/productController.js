import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
    // Admin panel usually doesn't send pageNumber and expects an array.
    // Frontend User app sends pageNumber and expects { products, page, pages }.
    if (!req.query.pageNumber && !req.query.keyword && !req.query.category) {
        const products = await Product.find({}).sort({ createdAt: -1 });
        return res.json(products);
    }

    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category ? { category: req.query.category } : {};

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'priceLowHigh') {
        sortOption = { price: 1 };
    } else if (req.query.sort === 'priceHighLow') {
        sortOption = { price: -1 };
    }

    const count = await Product.countDocuments({ ...keyword, ...category });
    const products = await Product.find({ ...keyword, ...category })
        .sort(sortOption)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) || 1 });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(404);
        throw new Error('Product not found with this ID');
    }
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, category, image, stock } = req.body;

    // Validation
    if (!title || !price || !description || !category || !image || stock === undefined) {
        res.status(400);
        throw new Error('Please provide all product details');
    }

    const product = new Product({
        title,
        price,
        description,
        category,
        image,
        stock,
    });

    const createdProduct = await product.save();
    res.status(201).json({
        success: true,
        product: createdProduct,
        message: 'Product created successfully'
    });
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
    const { title, price, description, category, image, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.title = title || product.title;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.image = image || product.image;
        product.stock = stock !== undefined ? stock : product.stock;

        const updatedProduct = await product.save();
        res.json({
            success: true,
            product: updatedProduct,
            message: 'Product updated successfully'
        });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
