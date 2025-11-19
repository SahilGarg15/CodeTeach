import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'code'],
    default: 'multiple-choice'
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: String, // For true-false or code questions
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  codeSnippet: String, // For code-based questions
  language: String // Programming language for code questions
});

const quizSchema = new mongoose.Schema({
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
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  questions: [quizQuestionSchema],
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Quiz duration is required'],
    default: 30
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70, // Percentage
    min: 0,
    max: 100
  },
  maxAttempts: {
    type: Number,
    default: 3 // 0 means unlimited
  },
  showAnswers: {
    type: Boolean,
    default: true // Show correct answers after completion
  },
  shuffleQuestions: {
    type: Boolean,
    default: true
  },
  shuffleOptions: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date,
    default: null
  },
  availableTo: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  next();
});

// Indexes
quizSchema.index({ course: 1, 'module.moduleId': 1 });
quizSchema.index({ 'topic.topicId': 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
