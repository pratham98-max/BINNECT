const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// 2. Connect to MongoDB
// In serverless, we connect but don't block the execution
connectDB();

// 3. Middleware
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Static Files (NOTE: Vercel does not persist local uploads)
// Local uploads will be wiped after every request. Use Cloudinary for production.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('🚀 Binnect API is running on Vercel Serverless...');
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

// 7. EXPORT FOR VERCEL (Crucial Change)
// Remove app.listen() for production
module.exports = app;