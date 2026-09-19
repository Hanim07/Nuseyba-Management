const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'MMS Backend is running' });
});

// Load routes
app.use('/api/v1/auth', require('./modules/auth/routes/auth.routes'));

// Error handling middleware skeleton
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: []
    }
  });
});

module.exports = app;
