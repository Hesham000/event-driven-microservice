const ActivityLogRepository = require('../../../../domain/repositories/ActivityLogRepository');
const ActivityLog = require('../../../../domain/models/ActivityLog');
const ActivityLogModel = require('../models/ActivityLogSchema');

/**
 * MongoDB implementation of the ActivityLogRepository
 */
class MongoActivityLogRepository extends ActivityLogRepository {
  /**
   * Create a new activity log
   * @param {ActivityLog} activityLog - The activity log to create
   * @returns {Promise<ActivityLog>} The created activity log
   */
  async create(activityLog) {
    const mongoDocument = await ActivityLogModel.create(activityLog.toJSON());
    return this._mapToDomainEntity(mongoDocument);
  }

  /**
   * Find an activity log by ID
   * @param {string} id - The activity log ID
   * @returns {Promise<ActivityLog|null>} The found activity log or null
   */
  async findById(id) {
    const mongoDocument = await ActivityLogModel.findById(id);
    return mongoDocument ? this._mapToDomainEntity(mongoDocument) : null;
  }

  /**
   * Update an activity log
   * @param {ActivityLog} activityLog - The activity log to update
   * @returns {Promise<ActivityLog>} The updated activity log
   */
  async update(activityLog) {
    const { id, ...data } = activityLog.toJSON();
    const mongoDocument = await ActivityLogModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    return this._mapToDomainEntity(mongoDocument);
  }

  /**
   * Delete an activity log
   * @param {string} id - The ID of the activity log to delete
   * @returns {Promise<boolean>} Whether the deletion was successful
   */
  async delete(id) {
    const result = await ActivityLogModel.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Find activity logs by user ID
   * @param {string} userId - The user ID
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<{ logs: ActivityLog[], total: number }>} Activity logs and total count
   */
  async findByUserId(userId, options = {}) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options;
    
    const [mongoDocuments, total] = await Promise.all([
      ActivityLogModel.find({ userId })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      ActivityLogModel.countDocuments({ userId })
    ]);
    
    const logs = mongoDocuments.map(doc => this._mapToDomainEntity(doc));
    return { logs, total };
  }

  /**
   * Find activity logs by resource
   * @param {string} resourceType - The resource type
   * @param {string} resourceId - The resource ID
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<{ logs: ActivityLog[], total: number }>} Activity logs and total count
   */
  async findByResource(resourceType, resourceId, options = {}) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options;
    
    const [mongoDocuments, total] = await Promise.all([
      ActivityLogModel.find({ resourceType, resourceId })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      ActivityLogModel.countDocuments({ resourceType, resourceId })
    ]);
    
    const logs = mongoDocuments.map(doc => this._mapToDomainEntity(doc));
    return { logs, total };
  }

  /**
   * Find pending activity logs
   * @param {number} limit - The maximum number of logs to retrieve
   * @returns {Promise<ActivityLog[]>} Pending activity logs
   */
  async findPending(limit = 100) {
    const mongoDocuments = await ActivityLogModel.find({ status: 'pending' })
      .sort({ createdAt: 1 })
      .limit(limit);
    
    return mongoDocuments.map(doc => this._mapToDomainEntity(doc));
  }

  /**
   * Find activity logs by filter criteria
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<{ logs: ActivityLog[], total: number }>} Activity logs and total count
   */
  async findByFilters(filters = {}, options = {}) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options;
    
    const mongoQuery = this._buildMongoQuery(filters);
    
    const [mongoDocuments, total] = await Promise.all([
      ActivityLogModel.find(mongoQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      ActivityLogModel.countDocuments(mongoQuery)
    ]);
    
    const logs = mongoDocuments.map(doc => this._mapToDomainEntity(doc));
    return { logs, total };
  }

  /**
   * Build a MongoDB query from filter criteria
   * @param {Object} filters - Filter criteria
   * @returns {Object} MongoDB query
   * @private
   */
  _buildMongoQuery(filters) {
    const query = {};
    
    if (filters.userId) query.userId = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.resourceType) query.resourceType = filters.resourceType;
    if (filters.resourceId) query.resourceId = filters.resourceId;
    if (filters.status) query.status = filters.status;
    
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }
    
    return query;
  }

  /**
   * Map a MongoDB document to a domain entity
   * @param {Object} mongoDocument - MongoDB document
   * @returns {ActivityLog} Domain entity
   * @private
   */
  _mapToDomainEntity(mongoDocument) {
    const plainData = mongoDocument.toObject();
    return ActivityLog.fromJSON({
      id: plainData._id.toString(),
      userId: plainData.userId,
      action: plainData.action,
      resourceType: plainData.resourceType,
      resourceId: plainData.resourceId,
      metadata: plainData.metadata ? Object.fromEntries(plainData.metadata) : {},
      ipAddress: plainData.ipAddress,
      userAgent: plainData.userAgent,
      status: plainData.status,
      processingErrors: plainData.processingErrors || [],
      createdAt: plainData.createdAt,
      processedAt: plainData.processedAt
    });
  }
}

module.exports = MongoActivityLogRepository; 