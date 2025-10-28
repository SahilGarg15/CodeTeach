import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
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
  topicId: {
    type: String,
    required: true
  },
  moduleId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'in-progress'
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index for unique progress tracking
progressSchema.index({ user: 1, course: 1, topicId: 1 }, { unique: true });
progressSchema.index({ user: 1, course: 1 });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
