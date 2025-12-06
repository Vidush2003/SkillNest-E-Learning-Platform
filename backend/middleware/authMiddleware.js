const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

const protect = async (req, res, next) => {
  let token;

  // Check if the token is sent in headers and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using the secret key
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. Get user data from DB using the ID in the token
      // We attach this user to the request object so future routes can use it
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Move to the next function/controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };