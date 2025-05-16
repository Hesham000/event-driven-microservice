/**
 * Use case for processing activity logs
 */
class ProcessActivityLog {
  /**
   * Create a new ProcessActivityLog use case
   * @param {LogProcessingService} logProcessingService - Service for processing logs
   */
  constructor(logProcessingService) {
    this.logProcessingService = logProcessingService;
  }

  /**
   * Execute the use case to process a single log
   * @param {string} logId - ID of the log to process
   * @returns {Promise<Object>} The processed log
   */
  async executeSingle(logId) {
    try {
      const log = await this.logProcessingService.activityLogRepository.findById(logId);
      
      if (!log) {
        throw new Error(`Activity log with ID ${logId} not found`);
      }
      
      const processedLog = await this.logProcessingService.processSingleLog(log);
      return processedLog.toJSON();
    } catch (error) {
      throw new Error(`Failed to process activity log: ${error.message}`);
    }
  }

  /**
   * Execute the use case to process a batch of pending logs
   * @param {number} batchSize - Number of logs to process in one batch
   * @returns {Promise<Object>} Processing statistics
   */
  async executeBatch(batchSize = 100) {
    try {
      return await this.logProcessingService.processPendingLogs(batchSize);
    } catch (error) {
      throw new Error(`Failed to process activity logs batch: ${error.message}`);
    }
  }
}

module.exports = ProcessActivityLog; 