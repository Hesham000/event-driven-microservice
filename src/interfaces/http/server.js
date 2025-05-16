const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../../infrastructure/config/logger');
const { errorHandler } = require('./middleware/errorHandler');
const activityLogRoutes = require('./routes/activityLogRoutes');

/**
 * Create Express server
 * @returns {Object} Express server instance
 */
function createServer() {
  const app = express();

  // Add security headers
  app.use(helmet());

  // Enable CORS
  app.use(cors());

  // Parse JSON request body
  app.use(express.json());

  // Log HTTP requests
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  // API routes
  app.use('/api/v1/activity-logs', activityLogRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // API documentation endpoint
  app.get('/api-docs', (req, res) => {
    res.status(200).json({
      name: 'Activity Log Microservice API',
      version: '1.0.0',
      description: 'API for managing and querying activity logs',
      endpoints: [
        { path: '/api/v1/activity-logs', method: 'POST', description: 'Create a new activity log' },
        { path: '/api/v1/activity-logs', method: 'GET', description: 'Get activity logs with filtering and pagination' },
        { path: '/api/v1/activity-logs/:id', method: 'GET', description: 'Get activity log by ID' },
        { path: '/health', method: 'GET', description: 'Health check endpoint' }
      ]
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: { message: 'Not Found', code: 'NOT_FOUND' } });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

module.exports = { createServer }; 