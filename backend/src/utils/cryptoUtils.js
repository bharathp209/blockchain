const crypto = require('crypto');
const fs = require('fs');

/**
 * Calculates SHA-256 hash of a string or buffer
 */
function calculateSha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Calculates SHA-256 hash of a local file
 */
function calculateFileHash(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

/**
 * Generates a deterministic canonical record hash from land record fields.
 * If any of these fields are modified, this hash will change.
 */
function generateRecordHash(record) {
  const canonicalPayload = [
    (record.survey_number || '').trim().toUpperCase(),
    (record.owner_name || '').trim(),
    (record.village || '').trim(),
    (record.district || '').trim(),
    (record.state || '').trim(),
    (record.land_area || '').trim(),
    (record.document_hash || '').trim()
  ].join('||');

  return calculateSha256(canonicalPayload);
}

module.exports = {
  calculateSha256,
  calculateFileHash,
  generateRecordHash
};
