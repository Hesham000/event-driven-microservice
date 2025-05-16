/**
 * Activity Log Domain Entity
 * Represents a user activity that needs to be tracked and processed
 */
class ActivityLog {
  /**
   * Create a new ActivityLog instance
   * 
   * @param {Object} params - The activity log parameters
   * @param {string} params.id - Unique identifier for the log
   * @param {string} params.userId - User who performed the action
   * @param {string} params.action - Action performed (e.g., 'login', 'create', 'update')
   * @param {string} params.resourceType - Type of resource acted upon (e.g., 'user', 'article')
   * @param {string} params.resourceId - ID of the specific resource
   * @param {Object} params.metadata - Additional context data
   * @param {string} [params.ipAddress] - IP address of the request
   * @param {string} [params.userAgent] - User agent of the request
   * @param {string} params.status - Processing status
   * @param {Array} params.processingErrors - Errors encountered during processing
   * @param {Date} params.createdAt - When the log was created
   * @param {Date} [params.processedAt] - When the log was processed
   */
  constructor({
    id = null,
    userId,
    action,
    resourceType,
    resourceId,
    metadata = {},
    ipAddress = null,
    userAgent = null,
    status = 'pending',
    processingErrors = [],
    createdAt = new Date(),
    processedAt = null
  }) {
    this.id = id;
    this.userId = userId;
    this.action = action;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.metadata = metadata;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.status = status;
    this.processingErrors = processingErrors;
    this.createdAt = createdAt;
    this.processedAt = processedAt;

    this.validate();
  }

  /**
   * Validate the entity data
   * @throws {Error} If validation fails
   */
  validate() {
    if (!this.userId) throw new Error('UserId is required');
    if (!this.action) throw new Error('Action is required');
    if (!this.resourceType) throw new Error('ResourceType is required');
    if (!this.resourceId) throw new Error('ResourceId is required');
    if (!['pending', 'processed', 'failed'].includes(this.status)) {
      throw new Error('Status must be pending, processed, or failed');
    }
  }

  /**
   * Mark the activity log as processed
   */
  markAsProcessed() {
    this.status = 'processed';
    this.processedAt = new Date();
    return this;
  }

  /**
   * Mark the activity log as failed with an error message
   * @param {string} errorMessage - The error message
   */
  markAsFailed(errorMessage) {
    this.status = 'failed';
    this.processingErrors.push({
      message: errorMessage,
      timestamp: new Date()
    });
    return this;
  }

  /**
   * Add metadata to the activity log
   * @param {string} key - The metadata key
   * @param {any} value - The metadata value
   */
  addMetadata(key, value) {
    this.metadata[key] = value;
    return this;
  }

  /**
   * Convert the entity to a plain object
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      action: this.action,
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      metadata: this.metadata,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      status: this.status,
      processingErrors: this.processingErrors,
      createdAt: this.createdAt,
      processedAt: this.processedAt
    };
  }

  /**
   * Create an ActivityLog from a plain object
   * @param {Object} data - Plain object with activity log data
   * @returns {ActivityLog} A new ActivityLog instance
   */
  static fromJSON(data) {
    return new ActivityLog(data);
  }
}

module.exports = ActivityLog; 