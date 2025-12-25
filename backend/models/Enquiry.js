const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // Firebase UID of the person sending the message
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, // The business receiving it
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);