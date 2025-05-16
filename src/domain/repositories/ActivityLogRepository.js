/**
 * Activity Log Repository Interface
 * Defines the contract for data access operations on ActivityLog entities
 */
class ActivityLogRepository {
  /**
   * Create a new activity log
   * @param {ActivityLog} activityLog - The activity log to create
   * @returns {Promise<ActivityLog>} The created activity log
   */
  async create(activityLog) {
    throw new Error('Method not implemented');
  }

  /**
   * Find an activity log by ID
   * @param {string} id - The activity log ID
   * @returns {Promise<ActivityLog|null>} The found activity log or null
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an activity log
   * @param {ActivityLog} activityLog - The activity log to update
   * @returns {Promise<ActivityLog>} The updated activity log
   */
  async update(activityLog) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete an activity log
   * @param {string} id - The ID of the activity log to delete
   * @returns {Promise<boolean>} Whether the deletion was successful
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Find activity logs by user ID
   * @param {string} userId - The user ID
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<{ logs: ActivityLog[], total: number }>} Activity logs and total count
   */
  async findByUserId(userId, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Find activity logs by resource
   * @param {string} resourceType - The resource type
   * @param {string} resourceId - The resource ID
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<{ logs: ActivityLog[], total: number }>} Activity logs and total count
   */
  async findByResource(resourceType, resourceId, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Find pending activity logs
   * @param {number} limit - The maximum number of logs to retrieve
   * @returns {Promise<ActivityLog[]>} Pending activity logs
   */
  async findPending(limit = 100) {
    throw new Error('Method not implemented');
  }

  /**
   * Find activity logs by filter criteria
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<{ logs: ActivityLog[], total: number }>} Activity logs and total count
   */
  async findByFilters(filters = {}, options = {}) {
    throw new Error('Method not implemented');
  }
}

module.exports = ActivityLogRepository; 