const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String }, // Maps to 'desiredService' in your route
  desiredService: { type: String },
  targetCustomer: { type: String },
  website: { type: String },
  ownerId: { type: String, required: true }, // Links to Firebase UID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);