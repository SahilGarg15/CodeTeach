import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  module: {
    moduleId: String,
    title: String
  },
  topic: {
    topicId: String,
    title: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Discussion title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Discussion content is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['Question', 'Discussion', 'Bug', 'Feature Request', 'General'],
    default: 'Question'
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    isInstructorReply: {
      type: Boolean,
      default: false
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isAccepted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
discussionSchema.index({ course: 1, createdAt: -1 });
discussionSchema.index({ user: 1, createdAt: -1 });
discussionSchema.index({ 'module.moduleId': 1, 'topic.topicId': 1 });
discussionSchema.index({ tags: 1 });
discussionSchema.index({ category: 1 });
discussionSchema.index({ lastActivity: -1 });

// Update lastActivity on new reply
discussionSchema.pre('save', function(next) {
  if (this.isModified('replies')) {
    this.lastActivity = Date.now();
  }
  next();
});

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;
