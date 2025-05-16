const { kafka, kafkaLogger, topic, consumerGroup } = require('../../../infrastructure/kafka/KafkaConfig');
const ProcessActivityLog = require('../../../application/usecases/ProcessActivityLog');
const LogProcessingService = require('../../../domain/services/LogProcessingService');
const MongoActivityLogRepository = require('../../../infrastructure/persistence/mongodb/repositories/MongoActivityLogRepository');

// Initialize required dependencies
const activityLogRepository = new MongoActivityLogRepository();
const logProcessingService = new LogProcessingService(activityLogRepository);
const processActivityLogUseCase = new ProcessActivityLog(logProcessingService);

// Create Kafka consumer
const consumer = kafka.consumer({
  groupId: consumerGroup,
  sessionTimeout: 30000,
  heartbeatInterval: 3000
});

/**
 * Set up and start the Kafka consumer
 */
async function setupKafkaConsumer() {
  try {
    // Connect consumer
    await consumer.connect();
    kafkaLogger.info('Consumer connected successfully');

    // Subscribe to topic
    await consumer.subscribe({
      topic,
      fromBeginning: false
    });
    kafkaLogger.info(`Consumer subscribed to topic: ${topic}`);

    // Set up message handler
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageKey = message.key.toString();
          kafkaLogger.info(`Processing message: ${messageKey} from partition ${partition}`);

          // Process the message
          await processActivityLogUseCase.executeSingle(messageKey);
          
          kafkaLogger.info(`Successfully processed message: ${messageKey}`);
        } catch (error) {
          kafkaLogger.error(`Error processing message: ${error.message}`);
        }
      }
    });

    // Also set up a batch processing job that runs periodically
    setInterval(async () => {
      try {
        const result = await processActivityLogUseCase.executeBatch(100);
        kafkaLogger.info(`Batch processing completed: ${result.processed} processed, ${result.failed} failed`);
      } catch (error) {
        kafkaLogger.error(`Error in batch processing: ${error.message}`);
      }
    }, 60000); // Run every minute

    kafkaLogger.info('Consumer started successfully');
    return consumer;
  } catch (error) {
    kafkaLogger.error(`Failed to set up consumer: ${error.message}`);
    throw error;
  }
}

/**
 * Stop the Kafka consumer
 */
async function stopKafkaConsumer() {
  try {
    await consumer.disconnect();
    kafkaLogger.info('Consumer disconnected successfully');
  } catch (error) {
    kafkaLogger.error(`Error disconnecting consumer: ${error.message}`);
  }
}

module.exports = {
  setupKafkaConsumer,
  stopKafkaConsumer
}; 