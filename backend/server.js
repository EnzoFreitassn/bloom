const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const Product = require('./models/Product');
const Category = require('./models/Category');
const seedData = require('./seedData');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'BLOOM API is running 🌸' }));

async function autoSeed() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty, auto-seeding starting...');
      
      const createdCats = await Category.insertMany(seedData.categories);
      const catMap = {};
      createdCats.forEach(cat => catMap[cat.slug] = cat._id);

      const productsWithCatIds = seedData.products.map(p => ({
        ...p,
        category: catMap[p.category]
      }));

      await Product.insertMany(productsWithCatIds);
      console.log('✅ Auto-seed successful with products from prints!');
    }
  } catch (err) {
    console.error('❌ Auto-seed failed:', err.message);
  }
}

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bloom-ecommerce')
  .then(async () => {
    console.log('✅ MongoDB connected');
    await autoSeed();
    app.listen(PORT, () => console.log(`🌸 BLOOM Server running on port ${PORT}`));
  })
  .catch(async (err) => {
    console.log('❌ MongoDB default connection failed. Starting In-Memory MongoDB for demo...', err.message);
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB connected at ${mongoUri}`);
      await autoSeed();
      app.listen(PORT, () => console.log(`🌸 BLOOM Server running on port ${PORT}`));
    } catch (memErr) {
      console.error('❌ Failed to start In-Memory MongoDB:', memErr.message);
      process.exit(1);
    }
  });
