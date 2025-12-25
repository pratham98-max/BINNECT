// backend/models/Review.js
const reviewSchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // Firebase UID
  senderName: String,
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// backend/models/Connection.js (Tracks "Who is using whose service")
const connectionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The Customer
  userName: String,
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, // The Business
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  startDate: { type: Date, default: Date.now }
});