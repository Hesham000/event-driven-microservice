const express = require('express');
const activityLogController = require('../controllers/ActivityLogController');
const { validate, createActivityLogValidation, queryActivityLogsValidation, getActivityLogByIdValidation } = require('../middleware/validator');

const router = express.Router();

/**
 * @route   POST /activity-logs
 * @desc    Create a new activity log
 * @access  Public
 */
router.post(
  '/',
  validate(createActivityLogValidation),
  activityLogController.create
);

/**
 * @route   GET /activity-logs
 * @desc    Get activity logs with filtering and pagination
 * @access  Public
 */
router.get(
  '/',
  validate(queryActivityLogsValidation),
  activityLogController.getAll
);

/**
 * @route   GET /activity-logs/:id
 * @desc    Get activity log by ID
 * @access  Public
 */
router.get(
  '/:id',
  validate(getActivityLogByIdValidation),
  activityLogController.getById
);

module.exports = router; 