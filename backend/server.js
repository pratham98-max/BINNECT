const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const aiRoutes = require('./routes/aiRoutes'); // For Gemini AI

const app = express();

// 2. Connect to MongoDB
connectDB();

// 3. Middleware
app.use(cors()); // Allows your React frontend to communicate with this server
app.use(express.json()); // Essential for parsing JSON data from request bodies

// 4. Register Routes
// Authentication (Login/Signup logic)
app.use('/api/auth', authRoutes);

// Business Listings (Registering and fetching niches)
app.use('/api/providers', providerRoutes);

// Messaging Hub (Enquiries, Sent/Received messages)
app.use('/api/enquiries', enquiryRoutes);

// AI Assistant (Gemini Chatbot integration)
app.use('/api/ai', aiRoutes);

// Root / Test Route
app.get('/', (req, res) => {
    res.send('🚀 Binnect API is live and running...');
});

// 5. Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n================================================`);
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🤖 Gemini AI Routes active at /api/ai/chat`);
    console.log(`================================================\n`);
});