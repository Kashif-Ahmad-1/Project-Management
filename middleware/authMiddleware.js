// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware to protect routes and verify JWT token
exports.protect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = decoded; // Attach decoded token data to request
    next();
  });
};

// Middleware to restrict access to admin users only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access restricted to admin only.' });
  }
  next();
};

// Middleware to restrict access to supervisors
exports.isSupervisor = (req, res, next) => {
  if (req.user.role !== 'supervisor') {
    return res.status(403).json({ message: 'Access restricted to supervisors only.' });
  }
  next();
};
