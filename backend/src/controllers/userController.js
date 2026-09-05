const db = require('../database/db');

function getUsers(req, res) {
  try {
    const users = db.all(`
      SELECT id, name, email, role, created_at, 'ACTIVE' as status
      FROM USERS 
      ORDER BY id ASC
    `);

    return res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
}

module.exports = {
  getUsers
};
