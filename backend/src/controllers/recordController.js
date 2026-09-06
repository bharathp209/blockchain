const path = require('path');
const fs = require('fs');
const db = require('../database/db');
const blockchain = require('../blockchain/Blockchain');
const { calculateSha256, calculateFileHash, generateRecordHash } = require('../utils/cryptoUtils');
const { logAudit } = require('../utils/auditLogger');

/**
 * Get all land records with optional search filter
 */
function getAllRecords(req, res) {
  try {
    const { search, status } = req.query;
    let query = `
      SELECT r.*, u.name as created_by_name 
      FROM LAND_RECORDS r
      LEFT JOIN USERS u ON r.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ` AND (
        r.survey_number LIKE ? OR 
        r.owner_name LIKE ? OR 
        r.village LIKE ? OR 
        r.district LIKE ?
      )`;
      params.push(term, term, term, term);
    }

    if (status && status.trim() !== '') {
      query += ` AND r.status = ?`;
      params.push(status.trim());
    }

    query += ' ORDER BY r.id DESC';

    const records = db.all(query, ...params);
    return res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error('Error fetching land records:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch land records.' });
  }
}

/**
 * Get land record by ID with full blockchain history and document info
 */
function getRecordById(req, res) {
  try {
    const { id } = req.params;
    const record = db.get(
      `SELECT r.*, u.name as created_by_name, u.email as created_by_email 
       FROM LAND_RECORDS r 
       LEFT JOIN USERS u ON r.created_by = u.id 
       WHERE r.id = ?`,
      id
    );

    if (!record) {
      return res.status(404).json({ success: false, message: 'Land record not found.' });
    }

    // Get linked document if any
    const document = db.get(
      'SELECT * FROM DOCUMENTS WHERE land_record_id = ? ORDER BY id DESC LIMIT 1',
      id
    );

    // Get all blockchain transactions linked to this record
    const transactions = db.all(
      `SELECT * FROM BLOCKCHAIN_TRANSACTIONS 
       WHERE land_record_id = ? 
       ORDER BY id DESC`,
      id
    );

    // Get audit logs for this survey number
    const auditLogs = db.all(
      `SELECT * FROM AUDIT_LOGS 
       WHERE resource LIKE ? 
       ORDER BY id DESC LIMIT 20`,
      `%${record.survey_number}%`
    );

    // Recalculate current hash to verify real-time status
    const currentHash = generateRecordHash(record);
    const latestTx = transactions.length > 0 ? transactions[0] : null;
    const isTampered = latestTx ? (currentHash !== latestTx.data_hash) : false;

    return res.json({
      success: true,
      record: {
        ...record,
        current_calculated_hash: currentHash,
        blockchain_anchored_hash: latestTx ? latestTx.data_hash : null,
        is_tampered: isTampered
      },
      document,
      transactions,
      auditLogs
    });
  } catch (error) {
    console.error('Error fetching record details:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch record details.' });
  }
}

/**
 * Register a new Land Record & Anchor to Blockchain
 * Roles: REGISTRAR, ADMIN
 */
function createRecord(req, res) {
  try {
    const {
      survey_number,
      owner_name,
      village,
      district,
      state = 'Tamil Nadu',
      land_area
    } = req.body;

    if (!survey_number || !owner_name || !village || !district || !land_area) {
      return res.status(400).json({
        success: false,
        message: 'All fields (survey_number, owner_name, village, district, land_area) are required.'
      });
    }

    const cleanSurveyNumber = survey_number.trim().toUpperCase();

    // Check survey number uniqueness
    const existing = db.get('SELECT id FROM LAND_RECORDS WHERE survey_number = ?', cleanSurveyNumber);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A land record with Survey Number '${cleanSurveyNumber}' already exists.`
      });
    }

    // Process Document upload & hash
    let documentName = 'default_land_deed.pdf';
    let documentHash = calculateSha256(`SEED_DEED_${cleanSurveyNumber}_${owner_name}`);
    let docFilePath = '';

    if (req.file) {
      documentName = req.file.originalname;
      docFilePath = req.file.path;
      documentHash = calculateFileHash(docFilePath);
    }

    const now = new Date().toISOString();

    // 1. Insert into SQLite LAND_RECORDS
    const result = db.run(
      `INSERT INTO LAND_RECORDS (
        survey_number, owner_name, village, district, state, land_area,
        document_name, document_hash, status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'REGISTERED', ?, ?, ?)`,
      cleanSurveyNumber,
      owner_name.trim(),
      village.trim(),
      district.trim(),
      state.trim(),
      land_area.trim(),
      documentName,
      documentHash,
      req.user.id,
      now,
      now
    );

    const recordId = result.lastInsertRowid;

    // 2. Insert into DOCUMENTS table
    if (req.file) {
      db.run(
        `INSERT INTO DOCUMENTS (land_record_id, filename, filepath, file_hash, uploaded_by, uploaded_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        recordId,
        documentName,
        docFilePath,
        documentHash,
        req.user.id,
        now
      );
    }

    // 3. Compute deterministic canonical Record Hash
    const recordPayload = {
      survey_number: cleanSurveyNumber,
      owner_name: owner_name.trim(),
      village: village.trim(),
      district: district.trim(),
      state: state.trim(),
      land_area: land_area.trim(),
      document_hash: documentHash
    };
    const recordHash = generateRecordHash(recordPayload);

    // 4. Create Blockchain Transaction
    const transactionId = `TX-${cleanSurveyNumber}-${Date.now().toString(36).toUpperCase()}`;
    const txPayload = {
      transaction_id: transactionId,
      transaction_type: 'ADD_LAND_RECORD',
      land_record_id: recordId,
      survey_number: cleanSurveyNumber,
      owner_name: owner_name.trim(),
      location: `${village.trim()}, ${district.trim()}, ${state.trim()}`,
      land_area: land_area.trim(),
      document_hash: documentHash,
      record_hash: recordHash,
      registered_by: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      timestamp: now
    };

    // 5. Mint new Block on Blockchain
    const newBlock = blockchain.addBlock(txPayload);

    // 6. Store Transaction in BLOCKCHAIN_TRANSACTIONS
    db.run(
      `INSERT INTO BLOCKCHAIN_TRANSACTIONS (
        transaction_id, transaction_type, land_record_id, user_id,
        data_hash, previous_hash, block_hash, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      transactionId,
      'ADD_LAND_RECORD',
      recordId,
      req.user.id,
      recordHash,
      newBlock.previousHash,
      newBlock.hash,
      now
    );

    // 7. Write Audit Log
    logAudit({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADD_LAND_RECORD',
      resource: `Survey No: ${cleanSurveyNumber}`,
      status: 'SUCCESS',
      details: {
        record_id: recordId,
        transaction_id: transactionId,
        block_index: newBlock.index,
        block_hash: newBlock.hash,
        record_hash: recordHash
      }
    });

    logAudit({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'BLOCK_CREATED',
      resource: `Block #${newBlock.index}`,
      status: 'SUCCESS',
      details: `Block #${newBlock.index} mined with TX: ${transactionId}`
    });

    return res.status(201).json({
      success: true,
      message: 'Land record successfully registered and anchored to blockchain.',
      record: {
        id: recordId,
        survey_number: cleanSurveyNumber,
        owner_name: owner_name.trim(),
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        land_area: land_area.trim(),
        document_name: documentName,
        document_hash: documentHash,
        status: 'REGISTERED'
      },
      blockchain: {
        transaction_id: transactionId,
        block_index: newBlock.index,
        block_hash: newBlock.hash,
        previous_hash: newBlock.previousHash,
        record_hash: recordHash,
        document_hash: documentHash,
        timestamp: now
      }
    });
  } catch (error) {
    console.error('Error creating land record:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create land record.'
    });
  }
}

/**
 * Update permitted fields on a Land Record (e.g. Ownership transfer/mutation)
 * Roles: REGISTRAR, ADMIN
 */
function updateRecord(req, res) {
  try {
    const { id } = req.params;
    const {
      owner_name,
      buyer_name,
      buyer_id_number,
      sale_value,
      deed_type = 'Absolute Sale Deed',
      stamp_duty,
      village,
      district,
      state,
      land_area,
      mutation_reason = 'Ownership transfer / sale deed execution'
    } = req.body;

    const existing = db.get('SELECT * FROM LAND_RECORDS WHERE id = ? OR survey_number = ?', id, id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Land record not found.' });
    }

    const updatedOwner = buyer_name ? buyer_name.trim() : (owner_name !== undefined ? owner_name.trim() : existing.owner_name);
    const updatedVillage = village !== undefined ? village.trim() : existing.village;
    const updatedDistrict = district !== undefined ? district.trim() : existing.district;
    const updatedState = state !== undefined ? state.trim() : existing.state;
    const updatedArea = land_area !== undefined ? land_area.trim() : existing.land_area;
    const now = new Date().toISOString();

    // 1. Update SQLite
    db.run(
      `UPDATE LAND_RECORDS SET
        owner_name = ?, village = ?, district = ?, state = ?, land_area = ?,
        status = 'REGISTERED', updated_at = ?
       WHERE id = ?`,
      updatedOwner,
      updatedVillage,
      updatedDistrict,
      updatedState,
      updatedArea,
      now,
      existing.id
    );

    // 2. Recalculate canonical Record Hash
    const updatedPayload = {
      survey_number: existing.survey_number,
      owner_name: updatedOwner,
      village: updatedVillage,
      district: updatedDistrict,
      state: updatedState,
      land_area: updatedArea,
      document_hash: existing.document_hash
    };
    const newRecordHash = generateRecordHash(updatedPayload);

    // 3. Create OWNERSHIP_MUTATION Blockchain Transaction
    const transactionId = `TX-MUT-${existing.survey_number}-${Date.now().toString(36).toUpperCase()}`;
    const txPayload = {
      transaction_id: transactionId,
      transaction_type: 'OWNERSHIP_MUTATION',
      land_record_id: existing.id,
      survey_number: existing.survey_number,
      seller_name: existing.owner_name,
      buyer_name: updatedOwner,
      previous_owner: existing.owner_name,
      new_owner: updatedOwner,
      buyer_id_number: buyer_id_number || 'N/A',
      sale_value: sale_value || 'N/A',
      deed_type,
      stamp_duty: stamp_duty || 'N/A',
      location: `${updatedVillage}, ${updatedDistrict}, ${updatedState}`,
      land_area: updatedArea,
      mutation_reason,
      document_hash: existing.document_hash,
      record_hash: newRecordHash,
      updated_by: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      timestamp: now
    };

    // 4. Mint new Block on Blockchain
    const newBlock = blockchain.addBlock(txPayload);

    // 5. Store Transaction in BLOCKCHAIN_TRANSACTIONS
    db.run(
      `INSERT INTO BLOCKCHAIN_TRANSACTIONS (
        transaction_id, transaction_type, land_record_id, user_id,
        data_hash, previous_hash, block_hash, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      transactionId,
      'OWNERSHIP_MUTATION',
      existing.id,
      req.user.id,
      newRecordHash,
      newBlock.previousHash,
      newBlock.hash,
      now
    );

    // 6. Audit Logging
    logAudit({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'OWNERSHIP_MUTATION',
      resource: `Survey No: ${existing.survey_number}`,
      status: 'SUCCESS',
      details: {
        record_id: existing.id,
        seller: existing.owner_name,
        buyer: updatedOwner,
        sale_value: sale_value || 'N/A',
        deed_type,
        transaction_id: transactionId,
        block_index: newBlock.index,
        record_hash: newRecordHash
      }
    });

    return res.json({
      success: true,
      message: 'Land ownership transfer successfully executed and anchored to blockchain.',
      transaction_id: transactionId,
      block_index: newBlock.index,
      record_hash: newRecordHash,
      block_hash: newBlock.hash,
      seller_name: existing.owner_name,
      buyer_name: updatedOwner,
      sale_value: sale_value || 'N/A',
      deed_type,
      timestamp: now
    });
  } catch (error) {
    console.error('Error updating land record:', error);
    return res.status(500).json({ success: false, message: 'Failed to update land record.' });
  }
}

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord
};
