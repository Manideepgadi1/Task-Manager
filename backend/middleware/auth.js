const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Check if user is employee or admin
exports.isEmployee = (req, res, next) => {
  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }
  next();
};
