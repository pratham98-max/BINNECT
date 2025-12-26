const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  targetCustomer: { type: String, required: true },
  desiredService: { type: String, required: true },
  website: { type: String, default: "" },
  // This will now store the path to the file on your server
  logoUrl: { 
    type: String, 
    default: "" 
  },
  reviews: [{
    userId: String,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  activeUsers: [{
    userId: String,
    name: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);