const db = require('../database/db');
const { logAudit } = require('../utils/auditLogger');
const { generateRecordHash } = require('../utils/cryptoUtils');

/**
 * Controlled Demo Tamper Simulation (ADMIN ONLY)
 * Directly alters SQLite data WITHOUT minting a blockchain transaction.
 */
function simulateTampering(req, res) {
  try {
    const { id } = req.params;
    const {
      fake_owner = 'Fake Owner (Unauthorized Fraud Alteration)',
      fake_area = null
    } = req.body;

    const record = db.get('SELECT * FROM LAND_RECORDS WHERE id = ?', id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    const previousOwner = record.owner_name;
    const updatedArea = fake_area || record.land_area;

    // DIRECT SQLITE MUTATION - BYPASSES BLOCKCHAIN COMPLETELY
    db.run(
      `UPDATE LAND_RECORDS SET 
        owner_name = ?, 
        land_area = ?,
        status = 'TAMPERED_UNCONFIRMED',
        updated_at = ?
       WHERE id = ?`,
      fake_owner,
      updatedArea,
      new Date().toISOString(),
      id
    );

    // Write audit log indicating tamper simulation was executed
    logAudit({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'TAMPER_SIMULATION_EXECUTED',
      resource: `Survey No: ${record.survey_number}`,
      status: 'SUCCESS',
      details: {
        note: 'DEMO CONTROLLED TAMPER SIMULATION: Direct SQLite modification executed without blockchain transaction.',
        original_owner: previousOwner,
        tampered_owner: fake_owner,
        record_id: id
      }
    });

    return res.json({
      success: true,
      message: 'DEMO SIMULATION: SQLite record altered directly without a blockchain transaction.',
      tampered: {
        id: record.id,
        survey_number: record.survey_number,
        original_owner: previousOwner,
        new_tampered_owner: fake_owner
      }
    });
  } catch (error) {
    console.error('Error simulating tampering:', error);
    return res.status(500).json({ success: false, message: 'Failed to simulate tampering.' });
  }
}

/**
 * Restores original record data from the blockchain transaction
 * Allows resetting the record after demoing tamper detection
 */
function restoreRecord(req, res) {
  try {
    const { id } = req.params;

    const record = db.get('SELECT * FROM LAND_RECORDS WHERE id = ?', id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    // Find the latest legitimate blockchain transaction
    const latestTx = db.get(
      `SELECT * FROM BLOCKCHAIN_TRANSACTIONS 
       WHERE land_record_id = ? 
       ORDER BY id DESC LIMIT 1`,
      id
    );

    if (!latestTx) {
      return res.status(400).json({ success: false, message: 'No blockchain reference found to restore from.' });
    }

    // Find the block in BLOCKS table
    const block = db.get('SELECT transaction_json FROM BLOCKS WHERE current_hash = ?', latestTx.block_hash);
    if (!block) {
      return res.status(400).json({ success: false, message: 'Block data not found.' });
    }

    const txData = JSON.parse(block.transaction_json);
    const restoredOwner = txData.new_owner || txData.owner_name || 'Ravi Kumar';
    const restoredArea = txData.land_area || record.land_area;

    // Restore SQLite record to match blockchain truth
    db.run(
      `UPDATE LAND_RECORDS SET 
        owner_name = ?, 
        land_area = ?,
        status = 'REGISTERED',
        updated_at = ?
       WHERE id = ?`,
      restoredOwner,
      restoredArea,
      new Date().toISOString(),
      id
    );

    logAudit({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'RECORD_RESTORED',
      resource: `Survey No: ${record.survey_number}`,
      status: 'SUCCESS',
      details: {
        note: 'Record restored to immutable blockchain truth state.',
        restored_owner: restoredOwner,
        record_id: id
      }
    });

    return res.json({
      success: true,
      message: 'Record successfully restored to match blockchain ledger truth.',
      restored_owner: restoredOwner
    });
  } catch (error) {
    console.error('Error restoring record:', error);
    return res.status(500).json({ success: false, message: 'Failed to restore record.' });
  }
}

module.exports = {
  simulateTampering,
  restoreRecord
};
