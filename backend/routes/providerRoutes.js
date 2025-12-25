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

// 4. SAVE BUSINESS ROUTE (FIXED)
router.post('/save/:id', protect, async (req, res) => {
  try {
    const providerId = req.params.id;
    const userId = req.user.uid; 
    const userUpdate = await User.findOneAndUpdate(
      { firebaseId: userId },
      { $addToSet: { savedProviders: providerId } },
      { new: true, upsert: true } 
    );
    console.log(`✅ Saved business ${providerId} for user ${userId}`);
    res.status(200).json({ message: "Successfully bookmarked!" });
  } catch (err) {
    console.error("❌ SAVE ERROR:", err.message);
    res.status(500).json({ message: "Server failed to save bookmark." });
  }
  // 5. GET SAVED BUSINESSES (GET)
router.get('/saved', protect, async (req, res) => {
  try {
    // Look for the user and 'fill in' the details from the Providers collection
    const user = await User.findOne({ firebaseId: req.user.uid }).populate('savedProviders');
    
    if (!user) {
      console.log("User record not found for UID:", req.user.uid);
      return res.status(404).json({ message: "User not found" });
    }
    
    // Send the array of FULL business objects back to the frontend
    res.json(user.savedProviders || []);
  } catch (err) {
    console.error("❌ FETCH SAVED ERROR:", err);
    res.status(500).json({ message: "Error fetching saved businesses" });
  }
});
// backend/routes/providerRoutes.js

// 6. REMOVE SAVED BUSINESS (DELETE)
router.delete('/saved/:id', protect, async (req, res) => {
  try {
    const providerId = req.params.id;
    const userId = req.user.uid; // From authMiddleware

    const userUpdate = await User.findOneAndUpdate(
      { firebaseId: userId },
      { $pull: { savedProviders: providerId } }, // Removes ID from array
      { new: true }
    );

    if (!userUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`🗑️ Removed business ${providerId} for user ${userId}`);
    res.status(200).json({ message: "Removed from saved" });
  } catch (err) {
    console.error("❌ REMOVE ERROR:", err.message);
    res.status(500).json({ message: "Failed to remove business." });
  }
});
});

module.exports = router;