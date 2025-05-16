const mongoose = require('mongoose');
const config = require('../../config/environment');
const logger = require('../../config/logger');

/**
 * Connect to MongoDB database
 */
async function connectDatabase() {
  try {
    // Configure MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    };

    // Connect to database
    await mongoose.connect(config.MONGODB.URI, options);

    // Log successful connection
    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Handle application termination and close connection gracefully
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
}

module.exports = {
  connectDatabase
}; 