const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postType: {
    type: String,
    enum: ['news', 'event'],
    required: true,
  },
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  location: {
    campus: {
      type: String,
      trim: true,
    },
    floor: {
      type: String,
      trim: true,
    },
    roomNo: {
      type: String,
      trim: true,
    },
  },
  eventDetails: {
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    isDateRange: {
      type: Boolean,
      default: false,
    },
    isTimeRange: {
      type: Boolean,
      default: false,
    },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorUsername: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

postSchema.index({ createdAt: -1 });
postSchema.index({ postType: 1 });

module.exports = mongoose.model('Post', postSchema);