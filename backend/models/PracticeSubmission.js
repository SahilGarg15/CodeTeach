import mongoose from 'mongoose';

const practiceSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  practiceSetId: {
    type: String,
    required: true
  },
  questionId: {
    type: String,
    required: true
  },
  userCode: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'java'
  },
  status: {
    type: String,
    enum: ['correct', 'incorrect', 'partial'],
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  testsPassed: {
    type: Number,
    default: 0
  },
  totalTests: {
    type: Number,
    default: 0
  },
  executionTime: {
    type: Number, // in milliseconds
    default: null
  },
  memoryUsed: {
    type: Number, // in KB
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
practiceSubmissionSchema.index({ user: 1, course: 1 });
practiceSubmissionSchema.index({ user: 1, practiceSetId: 1, questionId: 1 });

const PracticeSubmission = mongoose.model('PracticeSubmission', practiceSubmissionSchema);

export default PracticeSubmission;
