const jwt = require('jsonwebtoken');
const pool = require('../db');
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [decoded.id]);
      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user.rows[0]; 
      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
