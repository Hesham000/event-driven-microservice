const logger = require('../../../infrastructure/config/logger');

/**
 * Centralized error handling middleware
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack, 
    path: req.path,
    method: req.method
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Create error response
  const errorResponse = {
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : err.message,
      code: err.code || 'INTERNAL_ERROR'
    }
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * Custom API error class
 */
class ApiError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }

  /**
   * Create a not found error
   * @param {string} message - Error message
   * @returns {ApiError} Not found error
   */
  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404, 'NOT_FOUND');
  }

  /**
   * Create a bad request error
   * @param {string} message - Error message
   * @returns {ApiError} Bad request error
   */
  static badRequest(message = 'Bad request') {
    return new ApiError(message, 400, 'BAD_REQUEST');
  }

  /**
   * Create an unauthorized error
   * @param {string} message - Error message
   * @returns {ApiError} Unauthorized error
   */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401, 'UNAUTHORIZED');
  }

  /**
   * Create a forbidden error
   * @param {string} message - Error message
   * @returns {ApiError} Forbidden error
   */
  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403, 'FORBIDDEN');
  }

  /**
   * Create an internal server error
   * @param {string} message - Error message
   * @returns {ApiError} Internal server error
   */
  static internal(message = 'Internal server error') {
    return new ApiError(message, 500, 'INTERNAL_ERROR');
  }
}

module.exports = {
  errorHandler,
  ApiError
}; 