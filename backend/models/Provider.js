const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  // The Firebase UID of the user who created this niche
  ownerId: { 
    type: String, 
    required: true 
  },
  businessName: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  // Setting these to 'required' ensures your Profile Page always has data to display
  targetCustomer: { 
    type: String, 
    required: true 
  },
  desiredService: { 
    type: String, 
    required: true 
  },
  website: { 
    type: String, 
    default: "" 
  },
  // Array to store community feedback
  reviews: [{
    userId: String,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  // Array to track which users are currently using this niche service
  activeUsers: [{
    userId: String,
    name: String
  }]
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('Provider', providerSchema);