const ActivityLog = require('../../domain/models/ActivityLog');

/**
 * Use case for creating a new activity log
 */
class CreateActivityLog {
  /**
   * Create a new CreateActivityLog use case
   * @param {ActivityLogRepository} activityLogRepository - Repository for activity logs
   * @param {KafkaProducer} kafkaProducer - Kafka producer for sending activity logs
   */
  constructor(activityLogRepository, kafkaProducer) {
    this.activityLogRepository = activityLogRepository;
    this.kafkaProducer = kafkaProducer;
  }

  /**
   * Execute the use case
   * @param {Object} activityLogData - Data for the new activity log
   * @returns {Promise<Object>} The created activity log
   */
  async execute(activityLogData) {
    // Create domain entity
    const activityLog = new ActivityLog(activityLogData);

    // Persist to database
    const savedLog = await this.activityLogRepository.create(activityLog);
    
    try {
      // Try to publish to Kafka
      await this.kafkaProducer.sendMessage({
        key: savedLog.id,
        value: JSON.stringify(savedLog.toJSON())
      });
    } catch (kafkaError) {
      // If Kafka fails, we still return the saved log but with error info
      // The calling code can decide what to do with this information
      throw new Error(`Failed to send message to Kafka: ${kafkaError.message}. Log was saved to database.`);
    }

    return savedLog.toJSON();
  }
}

module.exports = CreateActivityLog; 