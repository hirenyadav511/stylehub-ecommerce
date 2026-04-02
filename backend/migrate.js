import mongoose from 'mongoose';

const migrate = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/emart');
        console.log('Connected to DB');
        const db = mongoose.connection.db;
        const result = await db.collection('products').updateMany(
            { title: { $exists: false }, name: { $exists: true } },
            { $rename: { 'name': 'title' } }
        );
        console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
