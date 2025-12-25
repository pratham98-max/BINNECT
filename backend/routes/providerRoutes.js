const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const User = require('../models/User'); 
const { protect } = require('../middleware/authMiddleware');

// 1. REGISTER ROUTE
router.post('/register', protect, async (req, res) => {
  try {
    const { businessName, category, desiredService, targetCustomer, website } = req.body;
    const newProvider = new Provider({
      businessName, category, description: desiredService, 
      desiredService, targetCustomer, website, ownerId: req.user.uid 
    });
    const savedProvider = await newProvider.save();
    res.status(201).json(savedProvider);
  } catch (err) {
    res.status(500).json({ message: "Database Error", details: err.message });
  }
});

// 2. MY BUSINESSES ROUTE
router.get('/my-businesses', protect, async (req, res) => {
  try {
    const myBusinesses = await Provider.find({ ownerId: req.user.uid });
    res.json(myBusinesses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your workspace" });
  }
});

// 3. SEARCH ROUTE
router.get('/search', async (req, res) => {
  try {
    const { query, category } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (query) {
      filter.$or = [
        { businessName: { $regex: query, $options: 'i' } },
        { desiredService: { $regex: query, $options: 'i' } },
        { targetCustomer: { $regex: query, $options: 'i' } }
      ];
    }
    const results = await Provider.find(filter).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 4. GET SAVED BUSINESSES
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.user.uid }).populate('savedProviders');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.savedProviders || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching saved businesses" });
  }
});

// 5. SAVE BUSINESS ROUTE
router.post('/save/:id', protect, async (req, res) => {
  try {
    const providerId = req.params.id;
    const userId = req.user.uid; 
    await User.findOneAndUpdate(
      { firebaseId: userId },
      { $addToSet: { savedProviders: providerId } },
      { new: true, upsert: true } 
    );
    res.status(200).json({ message: "Successfully bookmarked!" });
  } catch (err) {
    res.status(500).json({ message: "Server failed to save bookmark." });
  }
});

// 6. REMOVE SAVED BUSINESS (DELETE)
router.delete('/saved/:id', protect, async (req, res) => {
  try {
    const providerId = req.params.id;
    const userUpdate = await User.findOneAndUpdate(
      { firebaseId: req.user.uid },
      { $pull: { savedProviders: providerId } },
      { new: true }
    );
    if (!userUpdate) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Removed from saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove business." });
  }
});

// 7. NEW: GET SINGLE BUSINESS BY ID (FOR PROFILE VIEW)
router.get('/:id', async (req, res) => {
  try {
    const business = await Provider.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (err) {
    console.error("Single fetch error:", err);
    res.status(500).send('Server Error');
  }
  const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry'); // You'll need to create this model
const { protect } = require('../middleware/authMiddleware');

router.post('/:providerId', protect, async (req, res) => {
  try {
    const newEnquiry = new Enquiry({
      senderId: req.user.uid,
      providerId: req.params.providerId,
      message: req.body.message
    });
    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
});


module.exports = router;