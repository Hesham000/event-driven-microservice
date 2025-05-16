const { Kafka } = require('kafkajs');
const config = require('../config/environment');
const logger = require('../config/logger');

// Create Kafka client
const kafka = new Kafka({
  clientId: config.KAFKA.CLIENT_ID,
  brokers: config.KAFKA.BROKERS,
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

// Create custom logger for Kafka
const kafkaLogger = {
  info: message => logger.info(`[Kafka] ${message}`),
  error: message => logger.error(`[Kafka] ${message}`),
  warn: message => logger.warn(`[Kafka] ${message}`),
  debug: message => logger.debug(`[Kafka] ${message}`)
};

module.exports = {
  kafka,
  kafkaLogger,
  topic: config.KAFKA.TOPIC,
  consumerGroup: config.KAFKA.CONSUMER_GROUP
}; 