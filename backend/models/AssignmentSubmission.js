import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Assignment is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  content: {
    type: String, // For text/code submissions
    default: null
  },
  code: {
    type: String, // Specifically for code submissions
    default: null
  },
  language: {
    type: String,
    default: null
  },
  files: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  testResults: [{
    testCaseId: mongoose.Schema.Types.ObjectId,
    passed: Boolean,
    actualOutput: String,
    expectedOutput: String,
    executionTime: Number,
    error: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['submitted', 'grading', 'graded', 'returned'],
    default: 'submitted'
  },
  score: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  rubricScores: [{
    criterion: String,
    pointsEarned: Number,
    maxPoints: Number,
    feedback: String
  }],
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  gradedAt: {
    type: Date,
    default: null
  },
  isLate: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number,
    default: 0
  },
  finalScore: {
    type: Number,
    default: null
  },
  passed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
assignmentSubmissionSchema.index({ assignment: 1, user: 1, attemptNumber: 1 });
assignmentSubmissionSchema.index({ user: 1, course: 1 });
assignmentSubmissionSchema.index({ status: 1 });

// Calculate final score with late penalty
assignmentSubmissionSchema.pre('save', function(next) {
  if (this.status === 'graded' && this.score !== null) {
    this.finalScore = this.score - (this.score * (this.latePenalty / 100));
    
    // Check if passed
    mongoose.model('Assignment').findById(this.assignment).then(assignment => {
      const passingPercentage = (this.finalScore / assignment.totalPoints) * 100;
      this.passed = passingPercentage >= assignment.passingScore;
      next();
    }).catch(next);
  } else {
    next();
  }
});

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

export default AssignmentSubmission;
