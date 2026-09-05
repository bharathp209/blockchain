const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.resolve(__dirname, '../../data');
const uploadsDir = path.resolve(__dirname, '../../../uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '../../', process.env.DB_PATH) 
  : path.join(dataDir, 'landchain.db');

const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for optimal performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize database schema
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS USERS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN', 'REGISTRAR', 'CITIZEN')),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS LAND_RECORDS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      survey_number TEXT UNIQUE NOT NULL,
      owner_name TEXT NOT NULL,
      village TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      land_area TEXT NOT NULL,
      document_name TEXT,
      document_hash TEXT,
      status TEXT NOT NULL DEFAULT 'REGISTERED',
      created_by INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (created_by) REFERENCES USERS(id)
    );

    CREATE TABLE IF NOT EXISTS BLOCKS (
      block_index INTEGER PRIMARY KEY,
      timestamp TEXT NOT NULL,
      transaction_json TEXT NOT NULL,
      previous_hash TEXT NOT NULL,
      current_hash TEXT NOT NULL,
      nonce INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS BLOCKCHAIN_TRANSACTIONS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT UNIQUE NOT NULL,
      transaction_type TEXT NOT NULL,
      land_record_id INTEGER,
      user_id INTEGER,
      data_hash TEXT NOT NULL,
      previous_hash TEXT NOT NULL,
      block_hash TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (land_record_id) REFERENCES LAND_RECORDS(id),
      FOREIGN KEY (user_id) REFERENCES USERS(id)
    );

    CREATE TABLE IF NOT EXISTS AUDIT_LOGS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      user_role TEXT,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      status TEXT NOT NULL,
      details TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS DOCUMENTS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      land_record_id INTEGER,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      file_hash TEXT NOT NULL,
      uploaded_by INTEGER,
      uploaded_at TEXT NOT NULL,
      FOREIGN KEY (land_record_id) REFERENCES LAND_RECORDS(id),
      FOREIGN KEY (uploaded_by) REFERENCES USERS(id)
    );
  `);
}

initSchema();

/**
 * Convenient wrapper methods
 */
const dbHelper = {
  db,
  all(sql, ...params) {
    return db.prepare(sql).all(...params);
  },
  get(sql, ...params) {
    return db.prepare(sql).get(...params);
  },
  run(sql, ...params) {
    return db.prepare(sql).run(...params);
  },
  exec(sql) {
    return db.exec(sql);
  }
};

module.exports = dbHelper;
