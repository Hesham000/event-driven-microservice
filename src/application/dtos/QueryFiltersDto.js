/**
 * Data Transfer Object for Query Filters
 * Used for validating and normalizing query parameters
 */
class QueryFiltersDto {
  /**
   * Validate and normalize query filters
   * @param {Object} query - Query parameters from request
   * @returns {Object} Normalized filters and options
   */
  static fromQuery(query) {
    // Extract filter parameters
    const filters = {};
    
    // Add filter fields if they exist in query
    if (query.userId) filters.userId = query.userId;
    if (query.action) filters.action = query.action;
    if (query.resourceType) filters.resourceType = query.resourceType;
    if (query.resourceId) filters.resourceId = query.resourceId;
    if (query.status) filters.status = query.status;
    
    // Handle date range filters
    if (query.dateFrom) filters.dateFrom = new Date(query.dateFrom);
    if (query.dateTo) filters.dateTo = new Date(query.dateTo);
    
    // Extract pagination options
    const options = {
      skip: parseInt(query.skip, 10) || 0,
      limit: parseInt(query.limit, 10) || 20
    };
    
    // Ensure reasonable limits
    if (options.limit > 100) options.limit = 100;
    if (options.limit < 1) options.limit = 1;
    
    // Handle sorting
    if (query.sortBy) {
      const sortDir = query.sortDir === 'asc' ? 1 : -1;
      options.sort = { [query.sortBy]: sortDir };
    } else {
      // Default sort is by creation date, newest first
      options.sort = { createdAt: -1 };
    }
    
    return { filters, options };
  }
}

module.exports = QueryFiltersDto; 