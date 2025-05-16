require('dotenv').config();
const Joi = require('joi');

// Schema for checking our .env vars
// Note: We allow unknowns just in case we forget to document a new one
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),

  // Mongo stuff
  MONGODB_URI: Joi.string().required(),

  // Kafka setup
  KAFKA_BROKERS: Joi.string().required(),        // comma-separated
  KAFKA_CLIENT_ID: Joi.string().required(),
  KAFKA_CONSUMER_GROUP: Joi.string().required(),
  KAFKA_TOPIC: Joi.string().required(),

  // Logging level
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info')

}).unknown(); // not strict — don't fail on extra env vars

// Actually do the validation now
const { value: validatedEnv, error: validationError } = envSchema
  .prefs({ errors: { label: 'key' } })  // for better error readability
  .validate(process.env);

if (validationError) {
  // Crashing the app if critical env vars are missing or invalid
  throw new Error(`❌ Env config issue: ${validationError.message}`);
}

// Build final config object — easier to use in code later
const config = {
  ENV: validatedEnv.NODE_ENV,
  PORT: validatedEnv.PORT,

  MONGODB: {
    URI: validatedEnv.MONGODB_URI
  },

  KAFKA: {
    BROKERS: validatedEnv.KAFKA_BROKERS.split(','),  // TODO: should probably trim each entry
    CLIENT_ID: validatedEnv.KAFKA_CLIENT_ID,
    CONSUMER_GROUP: validatedEnv.KAFKA_CONSUMER_GROUP,
    TOPIC: validatedEnv.KAFKA_TOPIC
  },

  LOG_LEVEL: validatedEnv.LOG_LEVEL
};

module.exports = config;
