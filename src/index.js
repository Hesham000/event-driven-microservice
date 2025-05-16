const { createServer } = require('./interfaces/http/server');
const { connectDatabase } = require('./infrastructure/persistence/mongodb/MongoConnection');
const { setupKafkaConsumer } = require('./interfaces/kafka/consumers/activityLogConsumer');
const logger = require('./infrastructure/config/logger');
const config = require('./infrastructure/config/environment');

async function startApplication() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    logger.info('MongoDB connection established successfully');

    // Try to start Kafka Consumer, but continue if it fails
    try {
      await setupKafkaConsumer();
      logger.info('Kafka consumer started successfully');
    } catch (kafkaError) {
      logger.warn('Failed to connect to Kafka. The application will continue without Kafka functionality.');
      logger.warn(`Kafka error: ${kafkaError.message}`);
      logger.warn('Make sure Kafka is running or use docker-compose to start the full stack.');
    }

    // Start HTTP Server
    const server = createServer();
    server.listen(config.PORT, () => {
      logger.info(`HTTP server running on port ${config.PORT}`);
    });

  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startApplication(); 