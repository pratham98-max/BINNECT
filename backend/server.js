const express = require('express');
const cors = require('cors');
const path = require('path'); // Required for handling file paths
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
// Increased limit to handle image uploads via JSON if needed, 
// though Multer handles multipart independently
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Static Files (CRITICAL for local images)
// This makes http://localhost:5000/uploads/image.jpg accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/ai', aiRoutes);

// Root / Test Route
app.get('/', (req, res) => {
    res.send('🚀 Binnect API is live and running...');
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong on the server!',
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n================================================`);
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🖼️  Uploads available at http://localhost:${PORT}/uploads`);
    console.log(`================================================\n`);
});