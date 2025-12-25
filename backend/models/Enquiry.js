const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  senderId: { type: String, required: true }, 
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  message: { type: String, required: true },
  // Defaulting to empty array prevents frontend "undefined" crashes
  replies: [{
    senderId: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);