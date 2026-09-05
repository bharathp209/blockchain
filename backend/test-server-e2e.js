const { app } = require('./src/server');
const db = require('./src/database/db');
const seedDatabase = require('./src/database/seed');
const assert = require('assert');

// Port 5099 for testing to avoid collisions
const TEST_PORT = 5099;

async function runE2ETests() {
  console.log('🚀 Starting LANDCHAIN End-to-End Server & API Test Suite...');

  // Re-seed DB fresh
  seedDatabase();

  const server = app.listen(TEST_PORT, async () => {
    try {
      const baseUrl = `http://localhost:${TEST_PORT}/api`;

      // Helper for json requests
      const request = async (url, options = {}) => {
        const res = await fetch(url, options);
        const json = await res.json().catch(() => ({}));
        return { status: res.status, ok: res.ok, data: json };
      };

      // 1. Test Health
      console.log('\n[1] Health Check...');
      const health = await request(`${baseUrl}/health`);
      assert.strictEqual(health.status, 200);
      assert.strictEqual(health.data.status, 'ONLINE');
      console.log('✓ Health check passed');

      // 2. Test Logins
      console.log('\n[2] Authentication...');
      const adminLogin = await request(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@landchain.com', password: 'admin123' })
      });
      assert.strictEqual(adminLogin.status, 200);
      assert.ok(adminLogin.data.token, 'Admin should receive JWT token');
      const adminToken = adminLogin.data.token;

      const regLogin = await request(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'registrar@landchain.com', password: 'reg123' })
      });
      assert.strictEqual(regLogin.status, 200);
      const regToken = regLogin.data.token;

      const citLogin = await request(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'citizen@landchain.com', password: 'citizen123' })
      });
      assert.strictEqual(citLogin.status, 200);
      const citToken = citLogin.data.token;

      // Test bad login
      const badLogin = await request(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@landchain.com', password: 'wrongpassword' })
      });
      assert.strictEqual(badLogin.status, 401);
      console.log('✓ Authentication for Admin, Registrar, Citizen, and Invalid Login passed');

      // 3. Test RBAC: Citizen cannot create record
      console.log('\n[3] RBAC Protection: Citizen attempted mutation rejection...');
      const citizenCreateAttempt = await request(`${baseUrl}/land-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citToken}`
        },
        body: JSON.stringify({
          survey_number: 'ILLEGAL-01',
          owner_name: 'Intruder',
          village: 'Test',
          district: 'Test',
          land_area: '10 Acres'
        })
      });
      assert.strictEqual(citizenCreateAttempt.status, 403, 'Citizen must be rejected with 403 Forbidden');
      console.log('✓ Citizen modification rejected with 403 Forbidden');

      // Verify ACCESS_DENIED is recorded in audit logs
      const deniedLog = db.get("SELECT * FROM AUDIT_LOGS WHERE action = 'ACCESS_DENIED' AND user_name LIKE '%Karthik%'");
      assert.ok(deniedLog, 'ACCESS_DENIED must be present in audit log for Citizen');
      console.log('✓ ACCESS_DENIED successfully recorded in audit trail');

      // 4. Test Registrar Creates Record (TN-ERD-1024, Ravi Kumar)
      console.log('\n[4] Registrar Creates Record (TN-ERD-1024)...');
      const createRes = await request(`${baseUrl}/land-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${regToken}`
        },
        body: JSON.stringify({
          survey_number: 'TN-ERD-1024',
          owner_name: 'Ravi Kumar',
          village: 'Perundurai',
          district: 'Erode',
          state: 'Tamil Nadu',
          land_area: '2.50 Acres'
        })
      });
      assert.strictEqual(createRes.status, 201, 'Should return 201 Created');
      assert.ok(createRes.data.blockchain?.transaction_id, 'Should have minted transaction ID');
      assert.ok(createRes.data.blockchain?.block_hash, 'Should have block hash');
      const newRecordId = createRes.data.record.id;
      console.log(`✓ Record TN-ERD-1024 anchored in Block #${createRes.data.blockchain.block_index}`);

      // 5. Test Citizen Verifies Clean Record
      console.log('\n[5] Citizen Verifies Record TN-ERD-1024...');
      const verifyClean = await request(`${baseUrl}/land-records/${newRecordId}/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${citToken}` }
      });
      assert.strictEqual(verifyClean.status, 200);
      assert.strictEqual(verifyClean.data.verified, true);
      assert.strictEqual(verifyClean.data.hashes.hash_match, true);
      console.log('✓ Cryptographic Verification: RECORD VERIFIED (Hash Match: YES)');

      // 6. Test Tamper Simulation: Registrar cannot tamper (Admin only)
      console.log('\n[6] Tamper Simulation RBAC: Registrar attempted tamper...');
      const regTamperAttempt = await request(`${baseUrl}/demo/tamper/${newRecordId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${regToken}`
        },
        body: JSON.stringify({ fake_owner: 'Fake Owner' })
      });
      assert.strictEqual(regTamperAttempt.status, 403, 'Registrar cannot tamper, Admin only');
      console.log('✓ Tamper simulation restricted to ADMIN only (403)');

      // 7. Admin Executes Tamper Simulation
      console.log('\n[7] Admin Executes Controlled Tamper Simulation...');
      const adminTamper = await request(`${baseUrl}/demo/tamper/${newRecordId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ fake_owner: 'Fake Owner (Unauthorized Fraud)' })
      });
      assert.strictEqual(adminTamper.status, 200);
      console.log('✓ Tamper simulation executed (SQLite altered without blockchain block)');

      // 8. Re-Verify Record -> TAMPERING DETECTED!
      console.log('\n[8] Re-Verify Tampered Record...');
      const verifyTampered = await request(`${baseUrl}/land-records/${newRecordId}/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${citToken}` }
      });
      assert.strictEqual(verifyTampered.status, 200);
      assert.strictEqual(verifyTampered.data.verified, false, 'Verified must be false');
      assert.strictEqual(verifyTampered.data.status, 'TAMPERED');
      assert.strictEqual(verifyTampered.data.hashes.hash_match, false);
      assert.notStrictEqual(verifyTampered.data.hashes.original_hash, verifyTampered.data.hashes.current_hash);
      console.log('✓ Tamper Detection Triggered!');
      console.log(`   Original Hash: ${verifyTampered.data.hashes.original_hash}`);
      console.log(`   Current Hash:  ${verifyTampered.data.hashes.current_hash}`);

      // 9. Verify Audit Log for TAMPER_DETECTED
      console.log('\n[9] Audit Trail Verification for Tamper Event...');
      const tamperLog = db.get("SELECT * FROM AUDIT_LOGS WHERE action = 'TAMPER_DETECTED' ORDER BY id DESC LIMIT 1");
      assert.ok(tamperLog, 'TAMPER_DETECTED log must exist');
      console.log('✓ TAMPER_DETECTED recorded in audit trail with forensic details');

      // 10. Verify Blockchain Ledger Integrity
      console.log('\n[10] Blockchain Ledger Integrity Validation...');
      const bcValidation = await request(`${baseUrl}/blockchain/validate`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      assert.strictEqual(bcValidation.status, 200);
      assert.strictEqual(bcValidation.data.valid, true);
      console.log('✓ Blockchain ledger remains 100% pure and verified!');

      // 11. Restore Record
      console.log('\n[11] Admin Restores Record to Blockchain Truth...');
      const restoreRes = await request(`${baseUrl}/demo/restore/${newRecordId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      assert.strictEqual(restoreRes.status, 200);

      const verifyRestored = await request(`${baseUrl}/land-records/${newRecordId}/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${citToken}` }
      });
      assert.strictEqual(verifyRestored.data.verified, true);
      console.log('✓ Record successfully restored to match blockchain ledger truth');

      console.log('\n======================================================');
      console.log('🎉 ALL 11 END-TO-END SERVER & API TESTS PASSED 100%!');
      console.log('======================================================\n');

      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ E2E TEST FAILED:', err);
      server.close();
      process.exit(1);
    }
  });
}

runE2ETests();
