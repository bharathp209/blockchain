const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const blockchain = require('../blockchain/Blockchain');
const { calculateSha256, generateRecordHash } = require('../utils/cryptoUtils');

function seedDatabase() {
  console.log('🌱 Seeding LANDCHAIN database with realistic demo data...');

  // 1. Reset / Clear existing tables
  db.exec(`
    DELETE FROM AUDIT_LOGS;
    DELETE FROM DOCUMENTS;
    DELETE FROM BLOCKCHAIN_TRANSACTIONS;
    DELETE FROM BLOCKS;
    DELETE FROM LAND_RECORDS;
    DELETE FROM USERS;
    DELETE FROM sqlite_sequence WHERE name IN ('USERS', 'LAND_RECORDS', 'BLOCKS', 'BLOCKCHAIN_TRANSACTIONS', 'AUDIT_LOGS', 'DOCUMENTS');
  `);

  const now = new Date().toISOString();

  // 2. Create Demo Users with hashed passwords
  console.log('  → Creating demo user accounts...');
  const salt = bcrypt.genSaltSync(10);

  const adminHash = bcrypt.hashSync('admin123', salt);
  const regHash = bcrypt.hashSync('reg123', salt);
  const citizenHash = bcrypt.hashSync('citizen123', salt);

  const adminInsert = db.run(
    `INSERT INTO USERS (name, email, password_hash, role, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    'Dr. K. Swaminathan (Zonal Admin)',
    'admin@landchain.com',
    adminHash,
    'ADMIN',
    '2026-08-15T09:00:00.000Z'
  );
  const adminId = adminInsert.lastInsertRowid;

  const regInsert = db.run(
    `INSERT INTO USERS (name, email, password_hash, role, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    'S. Meenakshi (Sub-Registrar Erode)',
    'registrar@landchain.com',
    regHash,
    'REGISTRAR',
    '2026-08-16T10:00:00.000Z'
  );
  const registrarId = regInsert.lastInsertRowid;

  const citizenInsert = db.run(
    `INSERT INTO USERS (name, email, password_hash, role, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    'R. Karthik (Citizen / Landowner)',
    'citizen@landchain.com',
    citizenHash,
    'CITIZEN',
    '2026-08-20T11:30:00.000Z'
  );
  const citizenId = citizenInsert.lastInsertRowid;

  // Log initial system creation
  db.run(
    `INSERT INTO AUDIT_LOGS (user_id, user_name, user_role, action, resource, status, details, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    adminId,
    'Dr. K. Swaminathan',
    'ADMIN',
    'SYSTEM_INITIALIZED',
    'LANDCHAIN_CORE',
    'SUCCESS',
    'System initialized with role-based access control and demo credentials.',
    '2026-08-15T09:05:00.000Z'
  );

  // 3. Initialize Genesis Block
  console.log('  → Minting Genesis Block #0...');
  blockchain.chain = [];
  const genesisBlock = blockchain.createGenesisBlock();

  // 4. Sample Tamil Nadu / Erode Land Records
  const seedRecords = [
    {
      survey_number: 'TN-ERD-1001',
      owner_name: 'Ravi Kumar',
      village: 'Perundurai',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '3.20 Acres',
      doc_title: 'Title_Deed_Perundurai_1001.pdf'
    },
    {
      survey_number: 'TN-ERD-1002',
      owner_name: 'Selvi Murugan',
      village: 'Bhavani',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '1.85 Acres',
      doc_title: 'Patta_Transfer_Bhavani_1002.pdf'
    },
    {
      survey_number: 'TN-ERD-1003',
      owner_name: 'K. Senthil Nathan',
      village: 'Gobichettipalayam',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '5.40 Acres',
      doc_title: 'Title_Deed_Gobi_1003.pdf'
    },
    {
      survey_number: 'TN-ERD-1004',
      owner_name: 'Priya Sundaram',
      village: 'Anthiyur',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '4.10 Acres',
      doc_title: 'Agricultural_Settlement_1004.pdf'
    },
    {
      survey_number: 'TN-ERD-1005',
      owner_name: 'M. Palanisamy',
      village: 'Sathyamangalam',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '7.50 Acres',
      doc_title: 'Forest_Border_Grant_1005.pdf'
    },
    {
      survey_number: 'TN-ERD-1006',
      owner_name: 'Lakshmi Narayanan',
      village: 'Kodumudi',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '2.15 Acres',
      doc_title: 'Cauvery_Basin_Deed_1006.pdf'
    },
    {
      survey_number: 'TN-ERD-1007',
      owner_name: 'V. Radhakrishnan',
      village: 'Modakkurichi',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '3.60 Acres',
      doc_title: 'Village_Patta_Copy_1007.pdf'
    },
    {
      survey_number: 'TN-ERD-1008',
      owner_name: 'Deepa Thangavel',
      village: 'Chennimalai',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '1.50 Acres',
      doc_title: 'Handloom_Zone_Settlement_1008.pdf'
    },
    {
      survey_number: 'TN-ERD-1009',
      owner_name: 'C. Balasubramaniam',
      village: 'Nambiyur',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '6.00 Acres',
      doc_title: 'Dryland_Survey_Grant_1009.pdf'
    },
    {
      survey_number: 'TN-ERD-1010',
      owner_name: 'Dr. Anitha Ramesh',
      village: 'Erode City North',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '0.85 Acres (37,000 sq ft)',
      doc_title: 'Commercial_Zoning_Deed_1010.pdf'
    },
    {
      survey_number: 'TN-ERD-1024',
      owner_name: 'R. Karthik (Citizen / Landowner)',
      village: 'Perundurai West',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_area: '2.50 Acres',
      doc_title: 'Title_Deed_Perundurai_1024.pdf'
    }
  ];

  console.log('  → Seeding 11 land records & minting blockchain blocks...');

  const uploadsDir = path.resolve(__dirname, '../../../uploads');

  seedRecords.forEach((item, idx) => {
    const docHash = calculateSha256(`OFFICIAL_DOCUMENT_SEED_CONTENT_${item.survey_number}_${item.owner_name}`);
    const sampleDocContent = `GOVERNMENT OF TAMIL NADU - REGISTRATION DEPARTMENT
DISTRICT: ${item.district} | TALUK / VILLAGE: ${item.village}
SURVEY NUMBER: ${item.survey_number}
REGISTERED OWNER: ${item.owner_name}
LAND AREA: ${item.land_area}
CRYPTOGRAPHIC PROOF ANCHOR: SHA-256
DOCUMENT HASH: ${docHash}
STATUS: REGISTERED AND ANCHORED ON BLOCKCHAIN
[SMART INDIA HACKATHON 2026 - DEMO DATASET]`;

    const sampleDocPath = path.join(uploadsDir, item.doc_title);
    fs.writeFileSync(sampleDocPath, sampleDocContent, 'utf-8');

    const canonicalHash = generateRecordHash({
      survey_number: item.survey_number,
      owner_name: item.owner_name,
      village: item.village,
      district: item.district,
      state: item.state,
      land_area: item.land_area,
      document_hash: docHash
    });

    const recordTime = new Date(Date.now() - (10 - idx) * 3600 * 1000 * 6).toISOString();

    // Insert into LAND_RECORDS
    const recResult = db.run(
      `INSERT INTO LAND_RECORDS (
        survey_number, owner_name, village, district, state, land_area,
        document_name, document_hash, status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'REGISTERED', ?, ?, ?)`,
      item.survey_number,
      item.owner_name,
      item.village,
      item.district,
      item.state,
      item.land_area,
      item.doc_title,
      docHash,
      registrarId,
      recordTime,
      recordTime
    );

    const recordId = recResult.lastInsertRowid;

    // Insert into DOCUMENTS
    db.run(
      `INSERT INTO DOCUMENTS (land_record_id, filename, filepath, file_hash, uploaded_by, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      recordId,
      item.doc_title,
      sampleDocPath,
      docHash,
      registrarId,
      recordTime
    );

    // Mint Blockchain Block
    const txId = `TX-${item.survey_number}-INIT${(idx + 1).toString().padStart(3, '0')}`;
    const txPayload = {
      transaction_id: txId,
      transaction_type: 'ADD_LAND_RECORD',
      land_record_id: recordId,
      survey_number: item.survey_number,
      owner_name: item.owner_name,
      location: `${item.village}, ${item.district}, ${item.state}`,
      land_area: item.land_area,
      document_hash: docHash,
      record_hash: canonicalHash,
      registered_by: {
        id: registrarId,
        name: 'S. Meenakshi',
        role: 'REGISTRAR'
      },
      timestamp: recordTime
    };

    const block = blockchain.addBlock(txPayload);

    // Insert into BLOCKCHAIN_TRANSACTIONS
    db.run(
      `INSERT INTO BLOCKCHAIN_TRANSACTIONS (
        transaction_id, transaction_type, land_record_id, user_id,
        data_hash, previous_hash, block_hash, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      txId,
      'ADD_LAND_RECORD',
      recordId,
      registrarId,
      canonicalHash,
      block.previousHash,
      block.hash,
      recordTime
    );

    // Audit logs
    db.run(
      `INSERT INTO AUDIT_LOGS (user_id, user_name, user_role, action, resource, status, details, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      registrarId,
      'S. Meenakshi',
      'REGISTRAR',
      'ADD_LAND_RECORD',
      `Survey No: ${item.survey_number}`,
      'SUCCESS',
      `Registered land parcel for ${item.owner_name} (${item.land_area}) in Block #${block.index}`,
      recordTime
    );
  });

  // Add sample Citizen unauthorized attempt to populate ACCESS_DENIED audit log
  db.run(
    `INSERT INTO AUDIT_LOGS (user_id, user_name, user_role, action, resource, status, details, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    citizenId,
    'R. Karthik',
    'CITIZEN',
    'ACCESS_DENIED',
    'POST /api/land-records',
    'ACCESS_DENIED',
    `User 'citizen@landchain.com' with role 'CITIZEN' attempted unauthorized action requiring: [ADMIN, REGISTRAR]`,
    new Date(Date.now() - 3600 * 1000 * 2).toISOString()
  );

  console.log(`✅ Seeding complete!`);
  console.log(`   - 3 Demo Users: admin@landchain.com, registrar@landchain.com, citizen@landchain.com`);
  console.log(`   - 10 Land Records (TN-ERD-1001 to TN-ERD-1010)`);
  console.log(`   - 11 Blockchain Blocks (Genesis #0 + Blocks #1 to #10)`);
  console.log(`   - Realistic Audit Logs generated`);
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
