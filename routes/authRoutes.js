// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route for admin only
router.get('/admin', authMiddleware.protect, authMiddleware.isAdmin, (req, res) => {
  res.send('Welcome Admin');
});

// Protected route for supervisors only
router.get('/supervisor', authMiddleware.protect, authMiddleware.isSupervisor, (req, res) => {
  res.send('Welcome Supervisor');
});

module.exports = router;
