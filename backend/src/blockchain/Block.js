const { calculateSha256 } = require('../utils/cryptoUtils');

class Block {
  constructor(index, timestamp, transaction, previousHash = '', hash = null, nonce = 0) {
    this.index = index;
    this.timestamp = timestamp || new Date().toISOString();
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = hash || this.calculateHash();
  }

  /**
   * Calculates the block hash from its properties using SHA-256
   */
  calculateHash() {
    const rawData = `${this.index}|${this.timestamp}|${JSON.stringify(this.transaction)}|${this.previousHash}|${this.nonce}`;
    return calculateSha256(rawData);
  }
}

module.exports = Block;
