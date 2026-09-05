const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'landchain_platform_secure_blockchain_secret_key_98234';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required. Please login.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired session token.'
      });
    }

    const user = db.get('SELECT id, name, email, role FROM USERS WHERE id = ?', decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.'
      });
    }

    req.user = user;
    next();
  });
}

// Optional auth middleware (for public endpoints where auth is optional, like public search)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        const user = db.get('SELECT id, name, email, role FROM USERS WHERE id = ?', decoded.id);
        if (user) {
          req.user = user;
        }
      }
      next();
    });
  } else {
    next();
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
  JWT_SECRET
};
