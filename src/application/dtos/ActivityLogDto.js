/**
 * Data Transfer Object for Activity Logs
 * Used for creating and returning activity log data
 */
class ActivityLogDto {
  /**
   * Validate input data for creating a new activity log
   * @param {Object} data - Input data
   * @returns {Object} Validated data
   * @throws {Error} If validation fails
   */
  static validateCreate(data) {
    // Required fields
    const requiredFields = ['userId', 'action', 'resourceType', 'resourceId'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }
    
    // Validate specific fields if needed
    if (data.action && typeof data.action !== 'string') {
      throw new Error('action must be a string');
    }
    
    if (data.metadata && typeof data.metadata !== 'object') {
      throw new Error('metadata must be an object');
    }
    
    // Return validated data
    return {
      userId: data.userId,
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      metadata: data.metadata || {},
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null
    };
  }

  /**
   * Transform a domain entity to a DTO for API responses
   * @param {ActivityLog} activityLog - Domain entity
   * @returns {Object} DTO for API response
   */
  static toResponse(activityLog) {
    return {
      id: activityLog.id,
      userId: activityLog.userId,
      action: activityLog.action,
      resourceType: activityLog.resourceType,
      resourceId: activityLog.resourceId,
      metadata: activityLog.metadata,
      status: activityLog.status,
      createdAt: activityLog.createdAt,
      processedAt: activityLog.processedAt
    };
  }
}

module.exports = ActivityLogDto; 