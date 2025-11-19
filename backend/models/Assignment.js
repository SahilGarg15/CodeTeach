import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  module: {
    moduleId: {
      type: String,
      required: true
    },
    title: String
  },
  topic: {
    topicId: String,
    title: String
  },
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['code', 'essay', 'project', 'quiz', 'upload'],
    default: 'code'
  },
  requirements: [{
    type: String,
    trim: true
  }],
  rubric: [{
    criterion: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    description: String
  }],
  totalPoints: {
    type: Number,
    required: true,
    default: 100
  },
  passingScore: {
    type: Number,
    default: 60 // Percentage
  },
  dueDate: {
    type: Date,
    default: null
  },
  allowLateSubmission: {
    type: Boolean,
    default: true
  },
  lateSubmissionPenalty: {
    type: Number,
    default: 10 // Percentage deduction per day
  },
  maxAttempts: {
    type: Number,
    default: 1
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  starterCode: {
    type: String,
    default: null
  },
  language: {
    type: String,
    default: null // For coding assignments
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: {
      type: Boolean,
      default: false
    },
    points: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  autoGrade: {
    type: Boolean,
    default: false // For code assignments with test cases
  }
}, {
  timestamps: true
});

// Indexes
assignmentSchema.index({ course: 1, 'module.moduleId': 1 });
assignmentSchema.index({ 'topic.topicId': 1 });
assignmentSchema.index({ dueDate: 1 });

// Calculate total points from rubric
assignmentSchema.pre('save', function(next) {
  if (this.rubric && this.rubric.length > 0) {
    this.totalPoints = this.rubric.reduce((sum, item) => sum + item.points, 0);
  }
  next();
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
