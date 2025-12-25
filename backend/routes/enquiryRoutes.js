const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const Provider = require('../models/Provider');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/enquiries/:providerId
 * @desc    CREATE the initial enquiry (The "Send Inquiry" button)
 */
router.post('/:providerId', protect, async (req, res) => {
  try {
    const newEnquiry = new Enquiry({
      senderId: req.user.uid,
      providerId: req.params.providerId,
      message: req.body.message,
      replies: []
    });
    await newEnquiry.save();
    res.status(201).json(newEnquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/enquiries/my-inbox
 * @desc    GET Received Messages (For Business Owners)
 */
router.get('/my-inbox', protect, async (req, res) => {
  try {
    // 1. Find all businesses owned by the current user
    const myBusinesses = await Provider.find({ ownerId: req.user.uid });
    const bizIds = myBusinesses.map(b => b._id);

    // 2. Find enquiries sent TO those businesses
    const enquiries = await Enquiry.find({ providerId: { $in: bizIds } })
      .populate('providerId', 'businessName')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/enquiries/my-sent
 * @desc    GET Sent Messages (For the Enquirer/Sender)
 */
router.get('/my-sent', protect, async (req, res) => {
  try {
    const sent = await Enquiry.find({ senderId: req.user.uid })
      .populate('providerId', 'businessName')
      .sort({ createdAt: -1 });
    res.json(sent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/enquiries/reply/:id
 * @desc    REPLY to an existing enquiry thread
 */
router.post('/reply/:id', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) return res.status(404).json({ message: "Thread not found" });

    // Initialize replies array if it doesn't exist (safety check)
    if (!enquiry.replies) enquiry.replies = [];
    
    enquiry.replies.push({
      senderId: req.user.uid,
      text: text,
      timestamp: new Date()
    });

    await enquiry.save();
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;