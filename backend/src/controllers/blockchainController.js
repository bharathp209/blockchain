const blockchain = require('../blockchain/Blockchain');
const { logAudit } = require('../utils/auditLogger');

function getBlockchain(req, res) {
  try {
    const chain = blockchain.syncFromDb();
    return res.json({
      success: true,
      length: chain.length,
      chain: chain.map(b => ({
        index: b.index,
        timestamp: b.timestamp,
        transaction: b.transaction,
        previousHash: b.previousHash,
        hash: b.hash,
        nonce: b.nonce
      }))
    });
  } catch (error) {
    console.error('Error fetching blockchain:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve blockchain.' });
  }
}

function getBlockByIndex(req, res) {
  try {
    const { index } = req.params;
    const blockIndex = parseInt(index, 10);
    const chain = blockchain.syncFromDb();
    const block = chain.find(b => b.index === blockIndex);

    if (!block) {
      return res.status(404).json({ success: false, message: `Block #${index} not found.` });
    }

    return res.json({
      success: true,
      block
    });
  } catch (error) {
    console.error('Error fetching block:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve block.' });
  }
}

function validateBlockchain(req, res) {
  try {
    const result = blockchain.validateChain();
    const user = req.user || { id: null, name: 'System Auditor', role: 'AUDITOR' };

    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'BLOCKCHAIN_VALIDATED',
      resource: 'BLOCKCHAIN_LEDGER',
      status: result.valid ? 'SUCCESS' : 'FAILED',
      details: {
        block_count: result.blockCount,
        valid: result.valid,
        error: result.error || null
      }
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error validating blockchain:', error);
    return res.status(500).json({ success: false, message: 'Failed to validate blockchain.' });
  }
}

module.exports = {
  getBlockchain,
  getBlockByIndex,
  validateBlockchain
};
