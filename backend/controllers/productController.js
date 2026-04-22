import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
    // Admin panel usually doesn't send pageNumber and expects an array.
    if (!req.query.pageNumber && !req.query.keyword && !req.query.category && !req.query.brand && !req.query.gender && !req.query.size && !req.query.color) {
        const products = await Product.find({}).sort({ createdAt: -1 });
        return res.json(products);
    }

    const pageSize = 12; // Increased for shop view
    const page = Number(req.query.pageNumber) || 1;

    // Search by name or brand
    const keyword = req.query.keyword
        ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { brand: { $regex: req.query.keyword, $options: 'i' } }
            ]
        }
        : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const brand = req.query.brand ? { brand: req.query.brand } : {};
    const gender = req.query.gender ? { gender: req.query.gender } : {};
    
    // Variant-based filters
    const size = req.query.size ? { "variants.size": req.query.size } : {};
    const color = req.query.color ? { "variants.color": req.query.color } : {};

    // Price range filter
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;
    const priceFilter = {
        price: { $gte: minPrice, $lte: maxPrice === Infinity ? 1000000 : maxPrice }
    };

    // Rating filter
    const ratingFilter = req.query.rating && Number(req.query.rating) > 0 
        ? { rating: { $gte: Number(req.query.rating) } } 
        : {};

    // Stock filter (at least one variant in stock)
    const inStock = req.query.inStock === 'true' ? { "variants.stock": { $gt: 0 } } : {};

    const query = { 
        ...keyword, 
        ...category, 
        ...brand,
        ...gender,
        ...size,
        ...color,
        ...priceFilter, 
        ...ratingFilter, 
        ...inStock 
    };

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'priceLowHigh') {
        sortOption = { price: 1 };
    } else if (req.query.sort === 'priceHighLow') {
        sortOption = { price: -1 };
    } else if (req.query.sort === 'rating') {
        sortOption = { rating: -1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
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
    const { name, title, price, description, category, images, image, brand, gender, material, variants } = req.body;

    const finalName = name || title;
    const finalImages = images && images.length > 0 ? images : (image ? [image] : []);

    // Core Validation
    if (!finalName || !price || !category || finalImages.length === 0) {
        res.status(400);
        throw new Error('Please provide name, price, category and at least one image');
    }

    // Clothing/Variant Validation
    if (!variants || variants.length === 0) {
        res.status(400);
        throw new Error('Clothing products must have at least one variant (size, color, stock)');
    }

    // Validate variant consistency
    variants.forEach(v => {
        if (!v.size || !v.color || v.stock === undefined) {
            res.status(400);
            throw new Error('Each variant must have a size, color, and stock value');
        }
    });

    const product = new Product({
        name: finalName,
        price,
        description,
        category,
        images: finalImages,
        image: finalImages[0], // Maintains compatibility with older frontend components
        brand,
        gender,
        material,
        variants,
        stock: variants.reduce((acc, v) => acc + (v.stock || 0), 0) // Automatically calculate total stock
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
    const { name, title, price, description, category, image, images, stock, rating, brand, gender, material, variants } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || title || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        
        if (images && images.length > 0) {
            product.images = images;
            product.image = images[0];
        } else if (image) {
            product.images = [image];
            product.image = image;
        }

        product.stock = stock !== undefined ? stock : product.stock;
        product.rating = rating !== undefined ? rating : product.rating;
        product.brand = brand || product.brand;
        product.gender = gender || product.gender;
        product.material = material || product.material;
        product.variants = variants || product.variants;

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

/**
 * @desc    Create new review or update existing one
 * @route   POST /api/products/:id/review
 * @access  Private
 */
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment, username, fit } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.userId === req.auth.userId
        );

        if (alreadyReviewed) {
            // Update existing review
            alreadyReviewed.rating = Number(rating);
            alreadyReviewed.comment = comment;
            alreadyReviewed.username = username;
            alreadyReviewed.fit = fit || alreadyReviewed.fit;
        } else {
            // Add new review
            const review = {
                username,
                rating: Number(rating),
                comment,
                fit: fit || 'Perfect',
                userId: req.auth.userId,
            };
            product.reviews.push(review);
        }

        // Recalculate Average Rating and numReviews
        product.numReviews = product.reviews.length;
        product.averageRating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;
        
        // Sync the main rating field with averageRating for filtering compatibility
        product.rating = product.averageRating;

        await product.save();
        res.status(201).json({ message: 'Review added/updated successfuly' });
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
    createProductReview,
};
