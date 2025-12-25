const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const { protect } = require('../middleware/authMiddleware');

// Get all providers for Explore
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Niche not found" });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: "Invalid ID format" });
  }
});

// Register new niche
router.post('/', protect, async (req, res) => {
  try {
    const newProvider = new Provider({
      ...req.body,
      ownerId: req.user.uid,
      reviews: [],
      activeUsers: []
    });
    const saved = await newProvider.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Post a review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Niche not found" });

    const newReview = {
      userId: req.user.uid,
      userName: req.user.name || "Verified Member",
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    provider.reviews.push(newReview);
    await provider.save();
    res.status(201).json(provider.reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;