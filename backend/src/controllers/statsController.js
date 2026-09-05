const db = require('../database/db');
const blockchain = require('../blockchain/Blockchain');

function getDashboardStats(req, res) {
  try {
    const totalRecordsRow = db.get('SELECT COUNT(*) as count FROM LAND_RECORDS');
    const totalTxRow = db.get('SELECT COUNT(*) as count FROM BLOCKCHAIN_TRANSACTIONS');
    const verifiedRow = db.get("SELECT COUNT(*) as count FROM LAND_RECORDS WHERE status = 'REGISTERED'");
    const tamperedRow = db.get("SELECT COUNT(*) as count FROM LAND_RECORDS WHERE status = 'TAMPERED' OR status = 'TAMPERED_UNCONFIRMED'");
    const accessDeniedRow = db.get("SELECT COUNT(*) as count FROM AUDIT_LOGS WHERE action = 'ACCESS_DENIED' OR status = 'ACCESS_DENIED'");

    const recentTransactions = db.all(`
      SELECT t.*, r.survey_number, r.owner_name 
      FROM BLOCKCHAIN_TRANSACTIONS t
      LEFT JOIN LAND_RECORDS r ON t.land_record_id = r.id
      ORDER BY t.id DESC LIMIT 6
    `);

    const recentAuditEvents = db.all(`
      SELECT * FROM AUDIT_LOGS 
      ORDER BY id DESC LIMIT 8
    `);

    const securityAlerts = db.all(`
      SELECT * FROM AUDIT_LOGS 
      WHERE action IN ('TAMPER_DETECTED', 'ACCESS_DENIED', 'TAMPER_SIMULATION_EXECUTED')
      ORDER BY id DESC LIMIT 5
    `);

    const latestBlock = blockchain.getLatestBlock();

    return res.json({
      success: true,
      stats: {
        totalRecords: totalRecordsRow ? totalRecordsRow.count : 0,
        blockchainTransactions: totalTxRow ? totalTxRow.count : 0,
        verifiedRecords: verifiedRow ? verifiedRow.count : 0,
        tamperedRecords: tamperedRow ? tamperedRow.count : 0,
        accessDeniedAttempts: accessDeniedRow ? accessDeniedRow.count : 0,
        totalBlocks: blockchain.chain.length,
        latestBlockHash: latestBlock ? latestBlock.hash : '0000000000',
        latestBlockIndex: latestBlock ? latestBlock.index : 0
      },
      recentTransactions,
      recentAuditEvents,
      securityAlerts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
}

module.exports = {
  getDashboardStats
};
