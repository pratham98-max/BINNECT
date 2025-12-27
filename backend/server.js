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
connectDB();

// 3. Middleware
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/ai', aiRoutes);

// Root / Test Route
app.get('/', (req, res) => {
    res.send('🚀 Binnect API is live on Render...');
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong on the server!',
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

// 7. Start Server (CRITICAL for Render)
// Render expects your app to bind to a port
const PORT = process.env.PORT || 10000; // Render default port is 10000
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});