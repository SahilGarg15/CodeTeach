import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: String, // For multiple-choice
    answer: String, // For text/code answers
    isCorrect: {
      type: Boolean,
      default: false
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    timeTaken: Number // Time taken for this question in seconds
  }],
  score: {
    type: Number,
    required: true,
    default: 0
  },
  percentage: {
    type: Number,
    required: true,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    default: false
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  timeSpent: {
    type: Number, // Time spent in seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  }
}, {
  timestamps: true
});

// Indexes
quizAttemptSchema.index({ user: 1, quiz: 1, attemptNumber: 1 });
quizAttemptSchema.index({ quiz: 1, score: -1 });
quizAttemptSchema.index({ user: 1, course: 1 });

// Calculate score and percentage before saving
quizAttemptSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    this.score = this.answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
    this.percentage = (this.score / this.totalPoints) * 100;
    
    // Get quiz to check passing score
    mongoose.model('Quiz').findById(this.quiz).then(quiz => {
      this.passed = this.percentage >= quiz.passingScore;
      next();
    }).catch(next);
  } else {
    next();
  }
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt;
