const { logAudit } = require('../utils/auditLogger');

/**
 * Middleware factory for Role-Based Access Control
 * Automatically logs unauthorized access attempts to the audit trail
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      logAudit({
        userId: null,
        userName: 'UNAUTHENTICATED',
        userRole: 'ANONYMOUS',
        action: 'ACCESS_DENIED',
        resource: `${req.method} ${req.originalUrl || req.baseUrl + req.path}`,
        status: 'ACCESS_DENIED',
        details: `Anonymous request attempted to access protected resource requiring [${allowedRoles.join(', ')}]`
      });

      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Record denied access attempt in audit log
      logAudit({
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        action: 'ACCESS_DENIED',
        resource: `${req.method} ${req.originalUrl || req.baseUrl + req.path}`,
        status: 'ACCESS_DENIED',
        details: `User '${req.user.email}' with role '${req.user.role}' attempted unauthorized action requiring: [${allowedRoles.join(', ')}]`
      });

      return res.status(403).json({
        success: false,
        message: `Access Denied: Role '${req.user.role}' is not authorized to perform this action. Required: ${allowedRoles.join(' or ')}.`
      });
    }

    next();
  };
}

module.exports = {
  authorizeRoles
};
