const db = require('../database/db');

/**
 * Inserts an audit record into the AUDIT_LOGS table
 */
function logAudit({
  userId = null,
  userName = 'SYSTEM',
  userRole = 'SYSTEM',
  action,
  resource,
  status,
  details = ''
}) {
  try {
    const timestamp = new Date().toISOString();
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : String(details);

    db.run(
      `INSERT INTO AUDIT_LOGS (user_id, user_name, user_role, action, resource, status, details, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      userId,
      userName,
      userRole,
      action,
      resource,
      status,
      detailsStr,
      timestamp
    );

    console.log(`[AUDIT] [${timestamp}] [${userRole}:${userName}] ${action} on ${resource} -> ${status}`);
  } catch (err) {
    console.error('[AUDIT_ERROR] Failed to write audit log:', err);
  }
}

module.exports = {
  logAudit
};
