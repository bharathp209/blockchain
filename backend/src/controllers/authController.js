const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { logAudit } = require('../utils/auditLogger');
const { JWT_SECRET } = require('../middleware/auth');

function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = db.get('SELECT * FROM USERS WHERE email = ?', email.toLowerCase().trim());

    if (!user) {
      logAudit({
        userName: email,
        userRole: 'UNKNOWN',
        action: 'LOGIN_FAILED',
        resource: 'AUTH_SERVICE',
        status: 'FAILED',
        details: `Login attempt failed: Email '${email}' not found.`
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      logAudit({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'LOGIN_FAILED',
        resource: 'AUTH_SERVICE',
        status: 'FAILED',
        details: `Login attempt failed: Incorrect password for '${email}'.`
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'LOGIN_SUCCESS',
      resource: 'AUTH_SERVICE',
      status: 'SUCCESS',
      details: `User ${user.email} (${user.role}) authenticated successfully.`
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal error occurred during authentication.'
    });
  }
}

function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  return res.json({
    success: true,
    user: req.user
  });
}

module.exports = {
  login,
  getMe
};
