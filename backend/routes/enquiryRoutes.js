const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const Provider = require('../models/Provider');
const { protect } = require('../middleware/authMiddleware');

// Route to send an enquiry
router.post('/:providerId', protect, async (req, res) => {
  try {
    const newEnquiry = new Enquiry({
      senderId: req.user.uid,
      providerId: req.params.providerId,
      message: req.body.message
    });
    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for owners to see enquiries for their businesses
router.get('/my-inbox', protect, async (req, res) => {
  try {
    // 1. Find all businesses owned by this user
    const myBusinesses = await Provider.find({ ownerId: req.user.uid });
    const bizIds = myBusinesses.map(b => b._id);

    // 2. Find enquiries sent to those businesses
    const enquiries = await Enquiry.find({ providerId: { $in: bizIds } })
      .populate('providerId', 'businessName')
      .sort({ createdAt: -1 });
      
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;