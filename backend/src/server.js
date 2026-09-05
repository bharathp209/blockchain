require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const db = require('./database/db');
const blockchain = require('./blockchain/Blockchain');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually port 5173 or 3000)
app.use(cors({
  origin: true, // allow any origin in dev
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded documents safely
const uploadsPath = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'LANDCHAIN',
    system: 'Decentralized Land Record Security Protocol',
    blocksCount: blockchain.chain.length,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Global 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER_ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`⛓️  LANDCHAIN Backend Server running on http://localhost:${PORT}`);
  console.log(`🛡️  Decentralized Blockchain Land Records Security`);
  console.log(`📦  Local Blockchain initialized with ${blockchain.chain.length} blocks`);
  console.log('====================================================');
});

module.exports = { app, server };
