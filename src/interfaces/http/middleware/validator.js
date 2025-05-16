const { body, query, param, validationResult } = require('express-validator');
const { ApiError } = require('./errorHandler');

/**
 * Middleware to validate the request
 * @param {Array} validations - Validation rules
 * @returns {Function} Express middleware
 */
function validate(validations) {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    // Return validation error response
    return next(ApiError.badRequest('Validation Error', formattedErrors));
  };
}

/**
 * Validation rules for creating activity logs
 */
const createActivityLogValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('action').notEmpty().withMessage('Action is required'),
  body('resourceType').notEmpty().withMessage('Resource type is required'),
  body('resourceId').notEmpty().withMessage('Resource ID is required'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object')
];

/**
 * Validation rules for querying activity logs
 */
const queryActivityLogsValidation = [
  query('userId').optional().isString().withMessage('User ID must be a string'),
  query('action').optional().isString().withMessage('Action must be a string'),
  query('resourceType').optional().isString().withMessage('Resource type must be a string'),
  query('resourceId').optional().isString().withMessage('Resource ID must be a string'),
  query('status').optional().isIn(['pending', 'processed', 'failed']).withMessage('Status must be pending, processed, or failed'),
  query('dateFrom').optional().isISO8601().withMessage('Date from must be a valid ISO date'),
  query('dateTo').optional().isISO8601().withMessage('Date to must be a valid ISO date'),
  query('skip').optional().isInt({ min: 0 }).withMessage('Skip must be a non-negative integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['createdAt', 'action', 'status']).withMessage('Sort by must be a valid field'),
  query('sortDir').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be asc or desc')
];

/**
 * Validation rules for getting activity log by ID
 */
const getActivityLogByIdValidation = [
  param('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('ID must be a valid MongoDB ID')
];

module.exports = {
  validate,
  createActivityLogValidation,
  queryActivityLogsValidation,
  getActivityLogByIdValidation
}; 