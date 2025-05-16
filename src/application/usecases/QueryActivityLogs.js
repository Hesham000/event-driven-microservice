/**
 * Use case for querying activity logs
 */
class QueryActivityLogs {
  /**
   * Create a new QueryActivityLogs use case
   * @param {ActivityLogRepository} activityLogRepository - Repository for activity logs
   */
  constructor(activityLogRepository) {
    this.activityLogRepository = activityLogRepository;
  }

  /**
   * Execute the use case to query logs by filters
   * @param {Object} filters - Filter criteria for logs
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Object>} Logs and pagination data
   */
  async execute(filters = {}, options = {}) {
    try {
      const { logs, total } = await this.activityLogRepository.findByFilters(filters, options);
      
      // Extract pagination options
      const { skip = 0, limit = 20 } = options;
      
      // Calculate pagination metadata
      const page = Math.floor(skip / limit) + 1;
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;
      
      // Map domain entities to DTOs
      const items = logs.map(log => log.toJSON());
      
      // Return data with pagination metadata
      return {
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasMore
        }
      };
    } catch (error) {
      throw new Error(`Failed to query activity logs: ${error.message}`);
    }
  }

  /**
   * Execute the use case to get a log by ID
   * @param {string} id - The log ID
   * @returns {Promise<Object>} The log data
   */
  async getById(id) {
    try {
      const log = await this.activityLogRepository.findById(id);
      
      if (!log) {
        throw new Error(`Activity log with ID ${id} not found`);
      }
      
      return log.toJSON();
    } catch (error) {
      throw new Error(`Failed to get activity log: ${error.message}`);
    }
  }
}

module.exports = QueryActivityLogs; 