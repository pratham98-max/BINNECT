const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: String,
  photoURL: String,
  role: { type: String, enum: ['buyer', 'provider', 'admin'], default: 'buyer' },
  savedProviders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);