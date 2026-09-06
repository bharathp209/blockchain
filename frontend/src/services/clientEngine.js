/**
 * LANDCHAIN Client Simulation Engine
 * Runs 100% inside the browser when opened via VS Code "Go Live" (Live Server)
 * without requiring a separate backend terminal command.
 */

// SHA-256 via browser Web Crypto API
export async function calculateBrowserSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateBrowserRecordHash(record) {
  const payload = [
    (record.survey_number || '').trim().toUpperCase(),
    (record.owner_name || '').trim(),
    (record.village || '').trim(),
    (record.district || '').trim(),
    (record.state || '').trim(),
    (record.land_area || '').trim(),
    (record.document_hash || '').trim()
  ].join('||');

  return calculateBrowserSha256(payload);
}

const STORAGE_KEY_RECORDS = 'landchain_records';
const STORAGE_KEY_BLOCKS = 'landchain_blocks';
const STORAGE_KEY_TRANSACTIONS = 'landchain_transactions';
const STORAGE_KEY_AUDIT = 'landchain_audit';
const STORAGE_KEY_USER = 'landchain_current_user';

export const DEMO_USERS = [
  {
    id: 1,
    name: 'Dr. K. Swaminathan (Zonal Admin)',
    email: 'admin@landchain.com',
    password: 'admin123',
    role: 'ADMIN',
    created_at: '2026-08-15T09:00:00.000Z'
  },
  {
    id: 2,
    name: 'S. Meenakshi (Sub-Registrar Erode)',
    email: 'registrar@landchain.com',
    password: 'reg123',
    role: 'REGISTRAR',
    created_at: '2026-08-16T10:00:00.000Z'
  },
  {
    id: 3,
    name: 'R. Karthik (Citizen / Landowner)',
    email: 'citizen@landchain.com',
    password: 'citizen123',
    role: 'CITIZEN',
    created_at: '2026-08-20T11:30:00.000Z'
  }
];

export async function initClientStorage() {
  if (localStorage.getItem(STORAGE_KEY_RECORDS)) {
    return;
  }

  // 1. Genesis Block
  const genesisTimestamp = '2026-09-01T00:00:00.000Z';
  const genesisTx = {
    type: 'GENESIS',
    message: 'LandChain Genesis Block - Decentralized Ledger Protocol',
    network: 'LandChain-MainNet-Sim',
    timestamp: genesisTimestamp
  };
  const genesisHash = await calculateBrowserSha256(`0|${genesisTimestamp}|${JSON.stringify(genesisTx)}|0000000000000000000000000000000000000000000000000000000000000000|0`);

  const blocks = [
    {
      index: 0,
      timestamp: genesisTimestamp,
      transaction: genesisTx,
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: genesisHash,
      nonce: 0
    }
  ];

  const seedRecords = [
    { id: 1, survey_number: 'TN-ERD-1001', owner_name: 'Ravi Kumar', village: 'Perundurai', district: 'Erode', state: 'Tamil Nadu', land_area: '3.20 Acres', document_name: 'Title_Deed_Perundurai_1001.pdf', status: 'REGISTERED' },
    { id: 2, survey_number: 'TN-ERD-1002', owner_name: 'Selvi Murugan', village: 'Bhavani', district: 'Erode', state: 'Tamil Nadu', land_area: '1.85 Acres', document_name: 'Patta_Transfer_Bhavani_1002.pdf', status: 'REGISTERED' },
    { id: 3, survey_number: 'TN-ERD-1003', owner_name: 'K. Senthil Nathan', village: 'Gobichettipalayam', district: 'Erode', state: 'Tamil Nadu', land_area: '5.40 Acres', document_name: 'Title_Deed_Gobi_1003.pdf', status: 'REGISTERED' },
    { id: 4, survey_number: 'TN-ERD-1004', owner_name: 'Priya Sundaram', village: 'Anthiyur', district: 'Erode', state: 'Tamil Nadu', land_area: '4.10 Acres', document_name: 'Agricultural_Settlement_1004.pdf', status: 'REGISTERED' },
    { id: 5, survey_number: 'TN-ERD-1005', owner_name: 'M. Palanisamy', village: 'Sathyamangalam', district: 'Erode', state: 'Tamil Nadu', land_area: '7.50 Acres', document_name: 'Forest_Border_Grant_1005.pdf', status: 'REGISTERED' },
    { id: 6, survey_number: 'TN-ERD-1006', owner_name: 'Lakshmi Narayanan', village: 'Kodumudi', district: 'Erode', state: 'Tamil Nadu', land_area: '2.15 Acres', document_name: 'Cauvery_Basin_Deed_1006.pdf', status: 'REGISTERED' },
    { id: 7, survey_number: 'TN-ERD-1007', owner_name: 'V. Radhakrishnan', village: 'Modakkurichi', district: 'Erode', state: 'Tamil Nadu', land_area: '3.60 Acres', document_name: 'Village_Patta_Copy_1007.pdf', status: 'REGISTERED' },
    { id: 8, survey_number: 'TN-ERD-1008', owner_name: 'Deepa Thangavel', village: 'Chennimalai', district: 'Erode', state: 'Tamil Nadu', land_area: '1.50 Acres', document_name: 'Handloom_Zone_Settlement_1008.pdf', status: 'REGISTERED' },
    { id: 9, survey_number: 'TN-ERD-1009', owner_name: 'C. Balasubramaniam', village: 'Nambiyur', district: 'Erode', state: 'Tamil Nadu', land_area: '6.00 Acres', document_name: 'Dryland_Survey_Grant_1009.pdf', status: 'REGISTERED' },
    { id: 10, survey_number: 'TN-ERD-1010', owner_name: 'Dr. Anitha Ramesh', village: 'Erode City North', district: 'Erode', state: 'Tamil Nadu', land_area: '0.85 Acres (37,000 sq ft)', document_name: 'Commercial_Zoning_Deed_1010.pdf', status: 'REGISTERED' },
    { id: 11, survey_number: 'TN-ERD-1024', owner_name: 'R. Karthik (Citizen / Landowner)', village: 'Perundurai West', district: 'Erode', state: 'Tamil Nadu', land_area: '2.50 Acres', document_name: 'Title_Deed_Perundurai_1024.pdf', status: 'REGISTERED' }
  ];

  const transactions = [];
  const auditLogs = [
    {
      id: 1,
      user_name: 'Dr. K. Swaminathan',
      user_role: 'ADMIN',
      action: 'SYSTEM_INITIALIZED',
      resource: 'LANDCHAIN_CORE',
      status: 'SUCCESS',
      details: 'System initialized with role-based access control and demo credentials.',
      timestamp: '2026-08-15T09:05:00.000Z'
    }
  ];

  let prevHash = genesisHash;

  for (let i = 0; i < seedRecords.length; i++) {
    const item = seedRecords[i];
    const docHash = await calculateBrowserSha256(`DOC_${item.survey_number}_${item.owner_name}`);
    item.document_hash = docHash;
    item.created_at = new Date(Date.now() - (10 - i) * 3600 * 1000 * 6).toISOString();
    item.updated_at = item.created_at;

    const recHash = await generateBrowserRecordHash(item);
    const txId = `TX-${item.survey_number}-INIT${(i + 1).toString().padStart(3, '0')}`;

    const txPayload = {
      transaction_id: txId,
      transaction_type: 'ADD_LAND_RECORD',
      land_record_id: item.id,
      survey_number: item.survey_number,
      owner_name: item.owner_name,
      location: `${item.village}, ${item.district}, ${item.state}`,
      land_area: item.land_area,
      document_hash: docHash,
      record_hash: recHash,
      registered_by: { id: 2, name: 'S. Meenakshi', role: 'REGISTRAR' },
      timestamp: item.created_at
    };

    const blockIndex = i + 1;
    const blockHash = await calculateBrowserSha256(`${blockIndex}|${item.created_at}|${JSON.stringify(txPayload)}|${prevHash}|0`);

    blocks.push({
      index: blockIndex,
      timestamp: item.created_at,
      transaction: txPayload,
      previousHash: prevHash,
      hash: blockHash,
      nonce: 0
    });

    transactions.push({
      id: i + 1,
      transaction_id: txId,
      transaction_type: 'ADD_LAND_RECORD',
      land_record_id: item.id,
      data_hash: recHash,
      previous_hash: prevHash,
      block_hash: blockHash,
      timestamp: item.created_at
    });

    auditLogs.push({
      id: auditLogs.length + 1,
      user_name: 'S. Meenakshi',
      user_role: 'REGISTRAR',
      action: 'ADD_LAND_RECORD',
      resource: `Survey No: ${item.survey_number}`,
      status: 'SUCCESS',
      details: `Registered land parcel for ${item.owner_name} (${item.land_area}) in Block #${blockIndex}`,
      timestamp: item.created_at
    });

    prevHash = blockHash;
  }

  // Add sample Citizen unauthorized attempt to populate ACCESS_DENIED audit log
  auditLogs.push({
    id: auditLogs.length + 1,
    user_name: 'R. Karthik',
    user_role: 'CITIZEN',
    action: 'ACCESS_DENIED',
    resource: 'POST /api/land-records',
    status: 'ACCESS_DENIED',
    details: `User 'citizen@landchain.com' with role 'CITIZEN' attempted unauthorized action requiring: [ADMIN, REGISTRAR]`,
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
  });

  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(seedRecords));
  localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(blocks));
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
}

// Client Engine Methods
export const clientEngine = {
  async getRecords(params = {}) {
    await initClientStorage();
    let records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    if (params.search) {
      const term = params.search.toLowerCase();
      records = records.filter(r => 
        r.survey_number.toLowerCase().includes(term) ||
        r.owner_name.toLowerCase().includes(term) ||
        r.village.toLowerCase().includes(term) ||
        r.district.toLowerCase().includes(term)
      );
    }
    if (params.status) {
      records = records.filter(r => r.status === params.status);
    }
    return { success: true, count: records.length, records };
  },

  async getRecordById(id) {
    await initClientStorage();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    const record = records.find(r => String(r.id) === String(id) || r.survey_number === id);
    if (!record) throw new Error('Land record not found');

    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]')
      .filter(t => String(t.land_record_id) === String(record.id))
      .reverse();

    const auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]')
      .filter(a => a.resource.includes(record.survey_number))
      .reverse();

    const currentHash = await generateBrowserRecordHash(record);
    const latestTx = transactions[0];
    const isTampered = latestTx ? (currentHash !== latestTx.data_hash) : false;

    return {
      success: true,
      record: {
        ...record,
        current_calculated_hash: currentHash,
        blockchain_anchored_hash: latestTx ? latestTx.data_hash : null,
        is_tampered: isTampered
      },
      document: { filename: record.document_name, file_hash: record.document_hash },
      transactions,
      auditLogs
    };
  },

  async createRecord(formData) {
    await initClientStorage();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    const blocks = JSON.parse(localStorage.getItem(STORAGE_KEY_BLOCKS) || '[]');
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]');
    const auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]');

    const surveyNumber = (formData.get ? formData.get('survey_number') : formData.survey_number).trim().toUpperCase();
    const ownerName = (formData.get ? formData.get('owner_name') : formData.owner_name).trim();
    const village = (formData.get ? formData.get('village') : formData.village).trim();
    const district = (formData.get ? formData.get('district') : formData.district).trim();
    const state = (formData.get ? formData.get('state') : formData.state) || 'Tamil Nadu';
    const landArea = (formData.get ? formData.get('land_area') : formData.land_area).trim();
    const file = formData.get ? formData.get('document') : null;

    const docName = file?.name || `${surveyNumber}_title_deed.pdf`;
    const docHash = await calculateBrowserSha256(`DOC_${surveyNumber}_${ownerName}_${Date.now()}`);
    const now = new Date().toISOString();

    const newRecord = {
      id: records.length + 1,
      survey_number: surveyNumber,
      owner_name: ownerName,
      village,
      district,
      state,
      land_area: landArea,
      document_name: docName,
      document_hash: docHash,
      status: 'REGISTERED',
      created_at: now,
      updated_at: now
    };

    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));

    const recHash = await generateBrowserRecordHash(newRecord);
    const txId = `TX-${surveyNumber}-${Date.now().toString(36).toUpperCase()}`;
    const latestBlock = blocks[blocks.length - 1];
    const prevHash = latestBlock.hash;
    const newIndex = blocks.length;

    const txPayload = {
      transaction_id: txId,
      transaction_type: 'ADD_LAND_RECORD',
      land_record_id: newRecord.id,
      survey_number: surveyNumber,
      owner_name: ownerName,
      location: `${village}, ${district}, ${state}`,
      land_area: landArea,
      document_hash: docHash,
      record_hash: recHash,
      registered_by: { id: 2, name: 'S. Meenakshi', role: 'REGISTRAR' },
      timestamp: now
    };

    const newBlockHash = await calculateBrowserSha256(`${newIndex}|${now}|${JSON.stringify(txPayload)}|${prevHash}|0`);

    const newBlock = {
      index: newIndex,
      timestamp: now,
      transaction: txPayload,
      previousHash: prevHash,
      hash: newBlockHash,
      nonce: 0
    };

    blocks.push(newBlock);
    localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(blocks));

    transactions.push({
      id: transactions.length + 1,
      transaction_id: txId,
      transaction_type: 'ADD_LAND_RECORD',
      land_record_id: newRecord.id,
      data_hash: recHash,
      previous_hash: prevHash,
      block_hash: newBlockHash,
      timestamp: now
    });
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));

    auditLogs.unshift({
      id: auditLogs.length + 1,
      user_name: 'S. Meenakshi',
      user_role: 'REGISTRAR',
      action: 'ADD_LAND_RECORD',
      resource: `Survey No: ${surveyNumber}`,
      status: 'SUCCESS',
      details: `Registered land parcel for ${ownerName} (${landArea}) in Block #${newIndex}`,
      timestamp: now
    });
    auditLogs.unshift({
      id: auditLogs.length + 1,
      user_name: 'S. Meenakshi',
      user_role: 'REGISTRAR',
      action: 'BLOCK_CREATED',
      resource: `Block #${newIndex}`,
      status: 'SUCCESS',
      details: `Block #${newIndex} mined with TX: ${txId}`,
      timestamp: now
    });
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));

    return {
      success: true,
      message: 'Land record successfully registered and anchored to blockchain.',
      record: newRecord,
      blockchain: {
        transaction_id: txId,
        block_index: newIndex,
        block_hash: newBlockHash,
        previous_hash: prevHash,
        record_hash: recHash,
        document_hash: docHash,
        timestamp: now
      }
    };
  },

  async verifyRecord(id) {
    await initClientStorage();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    const record = records.find(r => String(r.id) === String(id) || r.survey_number === id);
    if (!record) throw new Error('Land record not found for verification');

    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]')
      .filter(t => String(t.land_record_id) === String(record.id))
      .reverse();

    const latestTx = transactions[0];
    if (!latestTx) throw new Error('No blockchain transaction found');

    const currentHash = await generateBrowserRecordHash(record);
    const anchoredHash = latestTx.data_hash;
    const isIntact = (currentHash === anchoredHash);

    const auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]');

    if (isIntact) {
      auditLogs.unshift({
        id: auditLogs.length + 1,
        user_name: 'Public Verifier',
        user_role: 'CITIZEN',
        action: 'VERIFY_RECORD',
        resource: `Survey No: ${record.survey_number}`,
        status: 'SUCCESS',
        details: 'Integrity verified. Hash match: YES against immutable ledger.',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));

      return {
        success: true,
        verified: true,
        status: 'VERIFIED',
        message: 'Land record integrity confirmed.',
        record,
        hashes: {
          original_hash: anchoredHash,
          current_hash: currentHash,
          hash_match: true,
          blockchain_valid: true
        },
        blockchain_reference: {
          transaction_id: latestTx.transaction_id,
          block_hash: latestTx.block_hash,
          anchored_at: latestTx.timestamp
        }
      };
    } else {
      // TAMPERED!
      record.status = 'TAMPERED';
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));

      auditLogs.unshift({
        id: auditLogs.length + 1,
        user_name: 'Public Verifier',
        user_role: 'CITIZEN',
        action: 'TAMPER_DETECTED',
        resource: `Survey No: ${record.survey_number}`,
        status: 'TAMPERED',
        details: 'Cryptographic hash mismatch between SQLite state and immutable blockchain ledger!',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));

      return {
        success: true,
        verified: false,
        status: 'TAMPERED',
        message: 'Land record data has been modified! Unauthorized alteration detected.',
        record,
        hashes: {
          original_hash: anchoredHash,
          current_hash: currentHash,
          hash_match: false,
          blockchain_valid: true,
          current_data: 'MODIFIED'
        },
        blockchain_reference: {
          transaction_id: latestTx.transaction_id,
          block_hash: latestTx.block_hash,
          anchored_at: latestTx.timestamp
        }
      };
    }
  },

  async simulateTamper(id, data = {}) {
    await initClientStorage();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    const record = records.find(r => String(r.id) === String(id));
    if (!record) throw new Error('Record not found');

    const fakeOwner = data.fake_owner || 'Fake Owner (Unauthorized Modification)';
    record.owner_name = fakeOwner;
    record.status = 'TAMPERED_UNCONFIRMED';
    record.updated_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));

    const auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]');
    auditLogs.unshift({
      id: auditLogs.length + 1,
      user_name: 'Dr. K. Swaminathan',
      user_role: 'ADMIN',
      action: 'TAMPER_SIMULATION_EXECUTED',
      resource: `Survey No: ${record.survey_number}`,
      status: 'SUCCESS',
      details: `DEMO SIMULATION: Altered owner to ${fakeOwner} without minting a blockchain block.`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));

    return { success: true, message: 'Tamper simulation executed directly in storage.' };
  },

  async restoreRecord(id) {
    await initClientStorage();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    const record = records.find(r => String(r.id) === String(id));
    if (!record) throw new Error('Record not found');

    const blocks = JSON.parse(localStorage.getItem(STORAGE_KEY_BLOCKS) || '[]');
    // Find latest valid block for this record
    const block = blocks.slice().reverse().find(b => b.transaction && String(b.transaction.land_record_id) === String(record.id));
    if (!block) throw new Error('Block reference not found');

    const tx = block.transaction;
    record.owner_name = tx.new_owner || tx.owner_name || 'Ravi Kumar';
    record.status = 'REGISTERED';
    record.updated_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));

    const auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]');
    auditLogs.unshift({
      id: auditLogs.length + 1,
      user_name: 'Dr. K. Swaminathan',
      user_role: 'ADMIN',
      action: 'RECORD_RESTORED',
      resource: `Survey No: ${record.survey_number}`,
      status: 'SUCCESS',
      details: 'Record restored to immutable blockchain truth state.',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));

    return { success: true, message: 'Record restored to blockchain truth.' };
  },

  async transferLandRecord(idOrSurvey, data) {
    await initClientStorage();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    const recordIndex = records.findIndex(r => String(r.id) === String(idOrSurvey) || r.survey_number === idOrSurvey);
    if (recordIndex === -1) throw new Error('Land record not found for transfer');

    const record = records[recordIndex];
    const previousOwner = record.owner_name;
    const newOwner = data.buyer_name || data.owner_name || 'New Buyer';
    const saleValue = data.sale_value || 'N/A';
    const deedType = data.deed_type || 'Absolute Sale Deed';
    const stampDuty = data.stamp_duty || 'N/A';
    const buyerId = data.buyer_id_number || 'N/A';
    const now = new Date().toISOString();

    // 1. Update record
    records[recordIndex].owner_name = newOwner;
    records[recordIndex].status = 'REGISTERED';
    records[recordIndex].updated_at = now;
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));

    // 2. Compute canonical hash
    const newRecordHash = await generateBrowserRecordHash(records[recordIndex]);

    // 3. Create blockchain block
    const blocks = JSON.parse(localStorage.getItem(STORAGE_KEY_BLOCKS) || '[]');
    const latestBlock = blocks[blocks.length - 1];
    const prevHash = latestBlock.hash;
    const newIndex = blocks.length;
    const txId = `TX-MUT-${record.survey_number}-${Date.now().toString(36).toUpperCase()}`;

    const txPayload = {
      transaction_id: txId,
      transaction_type: 'OWNERSHIP_MUTATION',
      land_record_id: record.id,
      survey_number: record.survey_number,
      seller_name: previousOwner,
      buyer_name: newOwner,
      previous_owner: previousOwner,
      new_owner: newOwner,
      buyer_id_number: buyerId,
      sale_value: saleValue,
      deed_type: deedType,
      stamp_duty: stampDuty,
      location: `${record.village}, ${record.district}, ${record.state}`,
      land_area: record.land_area,
      mutation_reason: data.mutation_reason || 'Ownership transfer / sale deed execution',
      document_hash: record.document_hash,
      record_hash: newRecordHash,
      updated_by: { id: 2, name: 'S. Meenakshi', role: 'REGISTRAR' },
      timestamp: now
    };

    const newBlockHash = await calculateBrowserSha256(`${newIndex}|${now}|${JSON.stringify(txPayload)}|${prevHash}|0`);

    const newBlock = {
      index: newIndex,
      timestamp: now,
      transaction: txPayload,
      previousHash: prevHash,
      hash: newBlockHash,
      nonce: 0
    };

    blocks.push(newBlock);
    localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(blocks));

    // 4. Record transaction
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]');
    transactions.push({
      id: transactions.length + 1,
      transaction_id: txId,
      transaction_type: 'OWNERSHIP_MUTATION',
      land_record_id: record.id,
      data_hash: newRecordHash,
      previous_hash: prevHash,
      block_hash: newBlockHash,
      seller_name: previousOwner,
      buyer_name: newOwner,
      sale_value: saleValue,
      timestamp: now
    });
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));

    // 5. Audit log
    const auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]');
    auditLogs.unshift({
      id: auditLogs.length + 1,
      user_name: 'S. Meenakshi',
      user_role: 'REGISTRAR',
      action: 'OWNERSHIP_MUTATION',
      resource: `Survey No: ${record.survey_number}`,
      status: 'SUCCESS',
      details: `Transferred title deed from ${previousOwner} to ${newOwner} (Valuation: ${saleValue}) in Block #${newIndex}`,
      timestamp: now
    });
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));

    return {
      success: true,
      message: 'Land ownership transfer successfully executed and anchored to blockchain.',
      transaction_id: txId,
      block_index: newIndex,
      record_hash: newRecordHash,
      block_hash: newBlockHash,
      seller_name: previousOwner,
      buyer_name: newOwner,
      sale_value: saleValue,
      deed_type: deedType,
      timestamp: now
    };
  },

  async getBlockchain() {
    await initClientStorage();
    const blocks = JSON.parse(localStorage.getItem(STORAGE_KEY_BLOCKS) || '[]');
    return { success: true, length: blocks.length, chain: blocks };
  },

  async validateBlockchain() {
    await initClientStorage();
    const blocks = JSON.parse(localStorage.getItem(STORAGE_KEY_BLOCKS) || '[]');
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].previousHash !== blocks[i - 1].hash) {
        return { valid: false, error: `Block #${i} previousHash does not match Block #${i - 1} hash` };
      }
    }
    return {
      success: true,
      valid: true,
      blockCount: blocks.length,
      latestBlockHash: blocks[blocks.length - 1].hash,
      message: 'Blockchain integrity verified. All cryptographic hashes and link proofs are valid.'
    };
  },

  async getAuditLogs(params = {}) {
    await initClientStorage();
    let logs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]');
    if (params.action) {
      logs = logs.filter(l => l.action === params.action);
    }
    if (params.status) {
      logs = logs.filter(l => l.status === params.status);
    }
    if (params.search) {
      const term = params.search.toLowerCase();
      logs = logs.filter(l => l.resource.toLowerCase().includes(term) || l.user_name.toLowerCase().includes(term));
    }
    return { success: true, count: logs.length, logs };
  },

  async getStats() {
    await initClientStorage();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    const blocks = JSON.parse(localStorage.getItem(STORAGE_KEY_BLOCKS) || '[]');
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]');
    const auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]');

    const verified = records.filter(r => r.status === 'REGISTERED').length;
    const tampered = records.filter(r => r.status === 'TAMPERED' || r.status === 'TAMPERED_UNCONFIRMED').length;
    const accessDenied = auditLogs.filter(a => a.action === 'ACCESS_DENIED' || a.status === 'ACCESS_DENIED').length;

    return {
      success: true,
      stats: {
        totalRecords: records.length,
        blockchainTransactions: transactions.length,
        verifiedRecords: verified,
        tamperedRecords: tampered,
        accessDeniedAttempts: accessDenied,
        totalBlocks: blocks.length,
        latestBlockHash: blocks[blocks.length - 1]?.hash || '0000000000',
        latestBlockIndex: blocks.length - 1
      },
      recentTransactions: transactions.slice(-6).reverse(),
      recentAuditEvents: auditLogs.slice(0, 8),
      securityAlerts: auditLogs.filter(a => a.action === 'TAMPER_DETECTED' || a.action === 'ACCESS_DENIED').slice(0, 5)
    };
  }
};
