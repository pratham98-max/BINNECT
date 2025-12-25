const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.post('/sync', protect, async (req, res) => {
  try {
    const { email } = req.body;
    // findOneAndUpdate with upsert:true creates the user if they don't exist
    const user = await User.findOneAndUpdate(
      { firebaseId: req.user.uid },
      { email: email },
      { upsert: true, new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Sync failed" });
  }
});

module.exports = router;