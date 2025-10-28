import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
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
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'dropped'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedTopics: [{
    type: String // topicId
  }],
  lastAccessedTopic: {
    type: String,
    default: null
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    review: {
      type: String,
      default: null
    },
    ratedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only enroll once in a course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1, status: 1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
