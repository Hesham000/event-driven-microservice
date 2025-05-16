const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  resourceType: {
    type: String, 
    required: true,
    index: true
  },
  resourceId: {
    type: String,
    required: true,
    index: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending',
    index: true
  },
  processingErrors: [{
    message: String,
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  processedAt: {
    type: Date,
    index: true
  }
}, {
  timestamps: true,
  collection: 'activitylogs',
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create compound indexes for common query patterns
ActivityLogSchema.index({ userId: 1, action: 1, createdAt: -1 });
ActivityLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
ActivityLogSchema.index({ status: 1, createdAt: -1 });

// Explicitly define the model with the collection name
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema, 'activitylogs');

module.exports = ActivityLog; 