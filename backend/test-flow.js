const assert = require('assert');
const path = require('path');
const db = require('./src/database/db');
const blockchain = require('./src/blockchain/Blockchain');
const seedDatabase = require('./src/database/seed');
const { generateRecordHash, calculateSha256 } = require('./src/utils/cryptoUtils');
const bcrypt = require('bcryptjs');

console.log('🧪 Starting LANDCHAIN automated verification test suite...');

// 1. Seed fresh DB
seedDatabase();

// 2. Test Blockchain Genesis and Blocks
console.log('\n--- 1. Testing Blockchain Engine ---');
const chain = blockchain.syncFromDb();
assert.strictEqual(chain.length, 11, 'Should have 11 blocks (0 to 10)');
assert.strictEqual(chain[0].index, 0, 'Block 0 should be Genesis');
assert.strictEqual(chain[0].previousHash, '0000000000000000000000000000000000000000000000000000000000000000');

const validationResult = blockchain.validateChain();
console.log('Validation result:', validationResult);
assert.strictEqual(validationResult.valid, true, 'Blockchain validation must pass');
console.log('✓ Blockchain integrity validated successfully');

// 3. Test Users & Passwords
console.log('\n--- 2. Testing Authentication & Passwords ---');
const adminUser = db.get("SELECT * FROM USERS WHERE email = 'admin@landchain.com'");
assert.ok(adminUser, 'Admin user should exist');
assert.ok(bcrypt.compareSync('admin123', adminUser.password_hash), 'Admin password should match');

const regUser = db.get("SELECT * FROM USERS WHERE email = 'registrar@landchain.com'");
assert.ok(regUser, 'Registrar user should exist');
assert.ok(bcrypt.compareSync('reg123', regUser.password_hash), 'Registrar password should match');

const citizenUser = db.get("SELECT * FROM USERS WHERE email = 'citizen@landchain.com'");
assert.ok(citizenUser, 'Citizen user should exist');
assert.ok(bcrypt.compareSync('citizen123', citizenUser.password_hash), 'Citizen password should match');
console.log('✓ All 3 demo user credentials and password hashes verified');

// 4. Test Verification of Clean Record
console.log('\n--- 3. Testing Land Record Verification ---');
const record = db.get("SELECT * FROM LAND_RECORDS WHERE survey_number = 'TN-ERD-1001'");
assert.ok(record, 'Record TN-ERD-1001 should exist');

const latestTx = db.get("SELECT * FROM BLOCKCHAIN_TRANSACTIONS WHERE land_record_id = ? ORDER BY id DESC LIMIT 1", record.id);
assert.ok(latestTx, 'Blockchain transaction must exist for TN-ERD-1001');

const currentHash = generateRecordHash(record);
assert.strictEqual(currentHash, latestTx.data_hash, 'Computed hash must match anchored hash');
console.log(`✓ Record ${record.survey_number} hash matches blockchain anchor: ${currentHash.slice(0, 16)}...`);

// 5. Test Tamper Simulation & Detection
console.log('\n--- 4. Testing Tamper Simulation & Tamper Detection ---');
// Modify SQLite directly without blockchain block
db.run("UPDATE LAND_RECORDS SET owner_name = 'Fake Owner' WHERE id = ?", record.id);
const tamperedRecord = db.get("SELECT * FROM LAND_RECORDS WHERE id = ?", record.id);
assert.strictEqual(tamperedRecord.owner_name, 'Fake Owner');

const tamperedHash = generateRecordHash(tamperedRecord);
assert.notStrictEqual(tamperedHash, latestTx.data_hash, 'Tampered hash must NOT match anchored hash');
console.log(`✓ Tamper simulation verified:`);
console.log(`   Anchored Blockchain Hash: ${latestTx.data_hash}`);
console.log(`   Tampered Computed Hash:   ${tamperedHash}`);
console.log('✓ Tamper detection logic successfully catches unauthorized modification!');

// 6. Test Blockchain Resilience
console.log('\n--- 5. Testing Blockchain Resilience Under Database Tampering ---');
const chainCheck = blockchain.validateChain();
assert.strictEqual(chainCheck.valid, true, 'Blockchain itself must remain valid and intact');
console.log('✓ Blockchain ledger remains 100% valid and untampered!');

// 7. Test Restoring Record
console.log('\n--- 6. Testing Record Restoration ---');
db.run("UPDATE LAND_RECORDS SET owner_name = 'Ravi Kumar' WHERE id = ?", record.id);
const restoredRecord = db.get("SELECT * FROM LAND_RECORDS WHERE id = ?", record.id);
const restoredHash = generateRecordHash(restoredRecord);
assert.strictEqual(restoredHash, latestTx.data_hash, 'Restored hash must match anchored hash again');
console.log('✓ Record restoration verified');

console.log('\n=========================================');
console.log('🎉 ALL BACKEND VERIFICATION TESTS PASSED!');
console.log('=========================================\n');
