const { ApiError } = require('../middleware/errorHandler');
const ActivityLogDto = require('../../../application/dtos/ActivityLogDto');
const QueryFiltersDto = require('../../../application/dtos/QueryFiltersDto');
const CreateActivityLog = require('../../../application/usecases/CreateActivityLog');
const QueryActivityLogs = require('../../../application/usecases/QueryActivityLogs');
const MongoActivityLogRepository = require('../../../infrastructure/persistence/mongodb/repositories/MongoActivityLogRepository');
const KafkaProducer = require('../../../infrastructure/kafka/KafkaProducer');
const logger = require('../../../infrastructure/config/logger');

// Initialize dependencies
const activityLogRepository = new MongoActivityLogRepository();
const kafkaProducer = new KafkaProducer();
const createActivityLogUseCase = new CreateActivityLog(activityLogRepository, kafkaProducer);
const queryActivityLogsUseCase = new QueryActivityLogs(activityLogRepository);

/**
 * Activity Log Controller
 */
class ActivityLogController {
  /**
   * Create a new activity log
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async create(req, res, next) {
    try {
      // Get request data and client info
      const requestData = req.body;
      const clientInfo = {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      };

      // Validate input data
      const validatedData = ActivityLogDto.validateCreate({
        ...requestData,
        ...clientInfo
      });

      try {
        // Execute use case
        const result = await createActivityLogUseCase.execute(validatedData);
        
        // Send response
        res.status(201).json(result);
      } catch (error) {
        // Check if it's a Kafka error but we can still save to DB
        if (error.message.includes('Failed to send message') || error.message.includes('Kafka')) {
          logger.warn(`Kafka error: ${error.message}. Saving to database only.`);
          
          // Create activity log directly in repo without Kafka
          const activityLog = new (require('../../../domain/models/ActivityLog'))(validatedData);
          const savedLog = await activityLogRepository.create(activityLog);
          
          // Send response with warning
          res.status(201).json({
            ...savedLog.toJSON(),
            warning: "Log saved to database but Kafka notification failed. Processing may be delayed."
          });
        } else {
          // For other errors, pass to error handler
          throw error;
        }
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get activity logs with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async getAll(req, res, next) {
    try {
      // Extract query parameters
      const { filters, options } = QueryFiltersDto.fromQuery(req.query);

      // Execute use case
      const result = await queryActivityLogsUseCase.execute(filters, options);

      // Send response
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get activity log by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      // Execute use case
      const result = await queryActivityLogsUseCase.getById(id);

      // If not found
      if (!result) {
        return next(ApiError.notFound(`Activity log with ID ${id} not found`));
      }

      // Send response
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActivityLogController(); 