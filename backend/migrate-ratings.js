import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const migrateRatings = async () => {
    try {
        const result = await Product.updateMany(
            { rating: { $exists: false } },
            { $set: { rating: 0 } }
        );
        console.log(`✅ Migration successful: Updated ${result.modifiedCount} products with default rating.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateRatings();
