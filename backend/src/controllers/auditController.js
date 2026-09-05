const db = require('../database/db');

function getAuditLogs(req, res) {
  try {
    const { action, status, user, search, limit = 100 } = req.query;

    let query = 'SELECT * FROM AUDIT_LOGS WHERE 1=1';
    const params = [];

    if (action && action.trim() !== '') {
      query += ' AND action = ?';
      params.push(action.trim());
    }

    if (status && status.trim() !== '') {
      query += ' AND status = ?';
      params.push(status.trim());
    }

    if (user && user.trim() !== '') {
      query += ' AND (user_name LIKE ? OR user_role LIKE ?)';
      const userTerm = `%${user.trim()}%`;
      params.push(userTerm, userTerm);
    }

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      query += ' AND (resource LIKE ? OR details LIKE ? OR action LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY id DESC LIMIT ?';
    params.push(parseInt(limit, 10) || 100);

    const logs = db.all(query, ...params);

    return res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit logs.' });
  }
}

module.exports = {
  getAuditLogs
};
