const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "Marketing", "IT", "Logistics"
  description: String,
  website: String,
  priceTier: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
  isVerified: { type: Boolean, default: false },
  location: {
    city: String,
    country: String
  },
  metrics: {
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  tags: [String] // Keywords for AI search like "SaaS", "Remote", "Cheap"
}, { timestamps: true });

module.exports = mongoose.model('Provider', ProviderSchema);