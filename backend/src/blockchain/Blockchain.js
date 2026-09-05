const Block = require('./Block');
const db = require('../database/db');

class Blockchain {
  constructor() {
    this.chain = [];
    this.init();
  }

  /**
   * Initializes chain by loading from database or minting Genesis block
   */
  init() {
    const rows = db.all('SELECT * FROM BLOCKS ORDER BY block_index ASC');
    if (rows && rows.length > 0) {
      this.chain = rows.map(r => {
        let tx = r.transaction_json;
        try {
          tx = JSON.parse(r.transaction_json);
        } catch {
          // keep as string if not JSON
        }
        return new Block(
          r.block_index,
          r.timestamp,
          tx,
          r.previous_hash,
          r.current_hash,
          r.nonce
        );
      });
    } else {
      this.createGenesisBlock();
    }
  }

  /**
   * Creates Block #0 (Genesis Block)
   */
  createGenesisBlock() {
    const timestamp = '2026-09-01T00:00:00.000Z';
    const genesisTx = {
      type: 'GENESIS',
      message: 'LandChain Genesis Block - Decentralized Ledger Protocol',
      network: 'LandChain-MainNet-Sim',
      timestamp
    };
    const genesisBlock = new Block(
      0,
      timestamp,
      genesisTx,
      '0000000000000000000000000000000000000000000000000000000000000000'
    );

    this.chain = [genesisBlock];

    db.run(
      `INSERT INTO BLOCKS (block_index, timestamp, transaction_json, previous_hash, current_hash, nonce)
       VALUES (?, ?, ?, ?, ?, ?)`,
      genesisBlock.index,
      genesisBlock.timestamp,
      JSON.stringify(genesisBlock.transaction),
      genesisBlock.previousHash,
      genesisBlock.hash,
      genesisBlock.nonce
    );

    return genesisBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Adds a new transaction block to the chain and persists to database
   */
  addBlock(transaction) {
    const latest = this.getLatestBlock();
    const newIndex = latest.index + 1;
    const timestamp = new Date().toISOString();
    const previousHash = latest.hash;

    const newBlock = new Block(newIndex, timestamp, transaction, previousHash);

    // Persist to database
    db.run(
      `INSERT INTO BLOCKS (block_index, timestamp, transaction_json, previous_hash, current_hash, nonce)
       VALUES (?, ?, ?, ?, ?, ?)`,
      newBlock.index,
      newBlock.timestamp,
      JSON.stringify(newBlock.transaction),
      newBlock.previousHash,
      newBlock.hash,
      newBlock.nonce
    );

    this.chain.push(newBlock);
    return newBlock;
  }

  /**
   * Validates cryptographic integrity of entire blockchain
   */
  validateChain() {
    this.syncFromDb();

    // Check Genesis block
    if (this.chain.length === 0) {
      return { valid: false, error: 'Blockchain is empty.' };
    }

    const genesis = this.chain[0];
    if (genesis.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
      return {
        valid: false,
        brokenBlockIndex: 0,
        error: 'Genesis block previous hash is corrupt.'
      };
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 1. Verify recalculated current hash matches stored hash
      const recalculatedHash = currentBlock.calculateHash();
      if (currentBlock.hash !== recalculatedHash) {
        return {
          valid: false,
          brokenBlockIndex: currentBlock.index,
          error: `Block #${currentBlock.index} hash mismatch. Computed: ${recalculatedHash}, Stored: ${currentBlock.hash}`
        };
      }

      // 2. Verify link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          valid: false,
          brokenBlockIndex: currentBlock.index,
          error: `Block #${currentBlock.index} previousHash (${currentBlock.previousHash}) does not link to Block #${previousBlock.index} hash (${previousBlock.hash})`
        };
      }
    }

    return {
      valid: true,
      blockCount: this.chain.length,
      latestBlockHash: this.getLatestBlock().hash,
      message: 'Blockchain integrity verified. All cryptographic hashes and link proofs are valid.'
    };
  }

  /**
   * Re-syncs memory representation from database
   */
  syncFromDb() {
    const rows = db.all('SELECT * FROM BLOCKS ORDER BY block_index ASC');
    this.chain = rows.map(r => {
      let tx = r.transaction_json;
      try {
        tx = JSON.parse(r.transaction_json);
      } catch {
        // ignore
      }
      return new Block(
        r.block_index,
        r.timestamp,
        tx,
        r.previous_hash,
        r.current_hash,
        r.nonce
      );
    });
    return this.chain;
  }
}

// Singleton blockchain instance
const blockchainInstance = new Blockchain();

module.exports = blockchainInstance;
