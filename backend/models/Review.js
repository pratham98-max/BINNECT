const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  verifiedClient: { type: Boolean, default: false } // Admin can verify if they were a real client
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);