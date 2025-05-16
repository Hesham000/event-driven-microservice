const { kafka, kafkaLogger, topic } = require('./KafkaConfig');

/**
 * Kafka Producer for sending activity log messages
 */
class KafkaProducer {
  constructor() {
    // Create Kafka producer instance
    this.producer = kafka.producer();
    this.topic = topic;
    this.isConnected = false;
  }

  /**
   * Connect to Kafka broker
   */
  async connect() {
    if (!this.isConnected) {
      try {
        await this.producer.connect();
        this.isConnected = true;
        kafkaLogger.info('Producer connected successfully');
      } catch (error) {
        kafkaLogger.error(`Producer connection error: ${error.message}`);
        throw error;
      }
    }
    return this;
  }

  /**
   * Disconnect from Kafka broker
   */
  async disconnect() {
    if (this.isConnected) {
      try {
        await this.producer.disconnect();
        this.isConnected = false;
        kafkaLogger.info('Producer disconnected successfully');
      } catch (error) {
        kafkaLogger.error(`Producer disconnection error: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Send a message to Kafka
   * @param {Object} message - The message to send
   * @param {string} message.key - Message key
   * @param {string} message.value - Message value
   * @returns {Promise<void>}
   */
  async sendMessage({ key, value }) {
    try {
      // Ensure producer is connected
      if (!this.isConnected) {
        await this.connect();
      }

      // Send message
      await this.producer.send({
        topic: this.topic,
        messages: [
          {
            key,
            value
          }
        ]
      });

      kafkaLogger.debug(`Message sent to topic ${this.topic} with key ${key}`);
    } catch (error) {
      kafkaLogger.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  }
}

module.exports = KafkaProducer; 