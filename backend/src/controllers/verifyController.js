const db = require('../database/db');
const { generateRecordHash } = require('../utils/cryptoUtils');
const { logAudit } = require('../utils/auditLogger');

/**
 * Verifies land record integrity against blockchain anchored state
 * Accessible by: ALL roles (ADMIN, REGISTRAR, CITIZEN) and Public
 */
function verifyRecord(req, res) {
  try {
    const { id } = req.params;

    // Fetch current record from SQLite
    const record = db.get('SELECT * FROM LAND_RECORDS WHERE id = ? OR survey_number = ?', id, id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Land record not found for verification.'
      });
    }

    // Recalculate hash of current data in SQLite
    const currentCalculatedHash = generateRecordHash(record);

    // Retrieve latest anchored blockchain transaction for this record
    const latestTx = db.get(
      `SELECT * FROM BLOCKCHAIN_TRANSACTIONS 
       WHERE land_record_id = ? 
       ORDER BY id DESC LIMIT 1`,
      record.id
    );

    if (!latestTx) {
      return res.status(400).json({
        success: false,
        message: 'No blockchain transaction found for this record.'
      });
    }

    const anchoredHash = latestTx.data_hash;
    const isIntact = (currentCalculatedHash === anchoredHash);

    const user = req.user || { id: null, name: 'Public Verifier', role: 'CITIZEN' };

    if (isIntact) {
      // Record verification in audit log
      logAudit({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'VERIFY_RECORD',
        resource: `Survey No: ${record.survey_number}`,
        status: 'SUCCESS',
        details: {
          survey_number: record.survey_number,
          owner: record.owner_name,
          hash_match: true,
          block_hash: latestTx.block_hash,
          transaction_id: latestTx.transaction_id
        }
      });

      return res.json({
        success: true,
        verified: true,
        status: 'VERIFIED',
        message: 'Land record integrity confirmed.',
        record: {
          id: record.id,
          survey_number: record.survey_number,
          owner_name: record.owner_name,
          village: record.village,
          district: record.district,
          state: record.state,
          land_area: record.land_area
        },
        hashes: {
          original_hash: anchoredHash,
          current_hash: currentCalculatedHash,
          hash_match: true,
          blockchain_valid: true
        },
        blockchain_reference: {
          transaction_id: latestTx.transaction_id,
          transaction_type: latestTx.transaction_type,
          block_hash: latestTx.block_hash,
          previous_hash: latestTx.previous_hash,
          anchored_at: latestTx.timestamp
        }
      });
    } else {
      // TAMPERING DETECTED!
      // Update SQLite record status flag to TAMPERED
      db.run("UPDATE LAND_RECORDS SET status = 'TAMPERED' WHERE id = ?", record.id);

      // Create a prominent security/audit log entry
      logAudit({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'TAMPER_DETECTED',
        resource: `Survey No: ${record.survey_number}`,
        status: 'TAMPERED',
        details: {
          survey_number: record.survey_number,
          current_owner: record.owner_name,
          original_anchored_hash: anchoredHash,
          current_recalculated_hash: currentCalculatedHash,
          tamper_alert: 'Cryptographic hash mismatch between SQLite state and immutable blockchain ledger!'
        }
      });

      return res.json({
        success: true,
        verified: false,
        status: 'TAMPERED',
        message: 'Land record data has been modified! Unauthorized alteration detected.',
        record: {
          id: record.id,
          survey_number: record.survey_number,
          owner_name: record.owner_name,
          village: record.village,
          district: record.district,
          state: record.state,
          land_area: record.land_area
        },
        hashes: {
          original_hash: anchoredHash,
          current_hash: currentCalculatedHash,
          hash_match: false,
          blockchain_valid: true,
          current_data: 'MODIFIED'
        },
        blockchain_reference: {
          transaction_id: latestTx.transaction_id,
          transaction_type: latestTx.transaction_type,
          block_hash: latestTx.block_hash,
          previous_hash: latestTx.previous_hash,
          anchored_at: latestTx.timestamp
        }
      });
    }
  } catch (error) {
    console.error('Error verifying record:', error);
    return res.status(500).json({
      success: false,
      message: 'Error executing cryptographic verification.'
    });
  }
}

module.exports = {
  verifyRecord
};
