const ActivityLog = require('../models/ActivityLog');

/**
 * Domain service for processing activity logs
 */
class LogProcessingService {
  /**
   * Create a LogProcessingService instance
   * @param {ActivityLogRepository} activityLogRepository - The repository for activity logs
   */
  constructor(activityLogRepository) {
    this.activityLogRepository = activityLogRepository;
  }

  /**
   * Process a batch of pending activity logs
   * @param {number} batchSize - Number of logs to process in one batch
   * @returns {Promise<{ processed: number, failed: number }>} Processing statistics
   */
  async processPendingLogs(batchSize = 100) {
    const pendingLogs = await this.activityLogRepository.findPending(batchSize);
    
    let processed = 0;
    let failed = 0;

    if (pendingLogs.length === 0) {
      return { processed, failed };
    }

    const processingPromises = pendingLogs.map(async (log) => {
      try {
        const processedLog = await this.processSingleLog(log);
        processed++;
        return processedLog;
      } catch (error) {
        log.markAsFailed(error.message);
        await this.activityLogRepository.update(log);
        failed++;
        return log;
      }
    });

    await Promise.all(processingPromises);
    
    return { processed, failed };
  }

  /**
   * Process a single activity log
   * @param {ActivityLog} activityLog - The activity log to process
   * @returns {Promise<ActivityLog>} The processed activity log
   */
  async processSingleLog(activityLog) {
    try {
      // Perform domain-specific processing on the activity log
      // This could involve:
      // 1. Enriching the log with additional data
      // 2. Validating the log against business rules
      // 3. Triggering side effects like notifications
      // 4. Applying complex business logic
      
      // For this example, we simply mark it as processed
      // In a real application, you would add your domain logic here
      
      // Example of enrichment (could be expanded based on business needs)
      this._enrichActivityLog(activityLog);
      
      // Mark as processed and save
      activityLog.markAsProcessed();
      return await this.activityLogRepository.update(activityLog);
    } catch (error) {
      activityLog.markAsFailed(error.message);
      throw error;
    }
  }

  /**
   * Enrich an activity log with additional context or derived data
   * @param {ActivityLog} activityLog - The activity log to enrich
   * @private
   */
  _enrichActivityLog(activityLog) {
    // Example enrichment logic
    // In a real application, this would contain business-specific logic
    
    // For example, calculate a severity level based on the action
    let severity = 'low';
    
    if (['delete', 'remove', 'purge'].includes(activityLog.action.toLowerCase())) {
      severity = 'high';
    } else if (['update', 'modify', 'change', 'edit'].includes(activityLog.action.toLowerCase())) {
      severity = 'medium';
    }
    
    activityLog.addMetadata('severity', severity);
    
    // Add a processable timestamp
    activityLog.addMetadata('processedTimestamp', Date.now());
    
    return activityLog;
  }
}

module.exports = LogProcessingService; 