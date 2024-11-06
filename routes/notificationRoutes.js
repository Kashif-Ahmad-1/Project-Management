const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming the auth middleware

const router = express.Router();

// Get notifications for a specific user
router.get('/', authMiddleware.protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // Get latest notifications first
      .limit(10); // Limit to 10 notifications for the API

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
