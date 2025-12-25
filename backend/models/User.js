const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true }, // This is the UID from Firebase
  email: { type: String },
  savedProviders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }], // Array of business IDs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);