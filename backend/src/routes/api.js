const express = require('express');
const router = express.Router();

const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const upload = require('../middleware/upload');

const authController = require('../controllers/authController');
const recordController = require('../controllers/recordController');
const verifyController = require('../controllers/verifyController');
const blockchainController = require('../controllers/blockchainController');
const auditController = require('../controllers/auditController');
const userController = require('../controllers/userController');
const demoController = require('../controllers/demoController');
const statsController = require('../controllers/statsController');

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);

// ==========================================
// DASHBOARD STATS
// ==========================================
router.get('/stats', authenticateToken, statsController.getDashboardStats);

// ==========================================
// LAND RECORDS ROUTES
// ==========================================
// Read: Allowed for ADMIN, REGISTRAR, CITIZEN
router.get('/land-records', authenticateToken, recordController.getAllRecords);
router.get('/land-records/:id', authenticateToken, recordController.getRecordById);

// Create / Mutation: Allowed ONLY for ADMIN & REGISTRAR
// Citizen access will trigger ACCESS_DENIED audit log and 403 Forbidden
router.post(
  '/land-records',
  authenticateToken,
  authorizeRoles('ADMIN', 'REGISTRAR'),
  upload.single('document'),
  recordController.createRecord
);

router.put(
  '/land-records/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'REGISTRAR'),
  recordController.updateRecord
);

// ==========================================
// VERIFICATION ROUTE (All roles & public)
// ==========================================
router.post('/land-records/:id/verify', optionalAuth, verifyController.verifyRecord);

// ==========================================
// BLOCKCHAIN ROUTES
// ==========================================
router.get('/blockchain', authenticateToken, blockchainController.getBlockchain);
router.get('/blockchain/validate', authenticateToken, blockchainController.validateBlockchain);
router.get('/blockchain/:index', authenticateToken, blockchainController.getBlockByIndex);

// ==========================================
// AUDIT LOGS ROUTES (Admin & Registrar)
// ==========================================
router.get(
  '/audit-logs',
  authenticateToken,
  authorizeRoles('ADMIN', 'REGISTRAR'),
  auditController.getAuditLogs
);

// ==========================================
// USER MANAGEMENT (ADMIN ONLY)
// ==========================================
router.get(
  '/users',
  authenticateToken,
  authorizeRoles('ADMIN'),
  userController.getUsers
);

// ==========================================
// DEMO TAMPER SIMULATION (ADMIN ONLY)
// ==========================================
router.post(
  '/demo/tamper/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  demoController.simulateTampering
);

router.post(
  '/demo/restore/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  demoController.restoreRecord
);

module.exports = router;
