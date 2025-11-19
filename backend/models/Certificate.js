import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: null // null means no expiry
  },
  completionDate: {
    type: Date,
    required: true
  },
  finalScore: {
    type: Number,
    default: null
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass', null],
    default: null
  },
  credentialUrl: {
    type: String,
    default: null
  },
  pdfUrl: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedReason: {
    type: String,
    default: null
  },
  revokedAt: {
    type: Date,
    default: null
  },
  metadata: {
    totalModules: Number,
    completedModules: Number,
    totalQuizzes: Number,
    averageQuizScore: Number,
    totalAssignments: Number,
    averageAssignmentScore: Number,
    totalHours: Number
  }
}, {
  timestamps: true
});

// Indexes
certificateSchema.index({ certificateId: 1 }, { unique: true });
certificateSchema.index({ user: 1, course: 1 });
certificateSchema.index({ issuedDate: -1 });

// Generate unique certificate ID before saving
certificateSchema.pre('save', async function(next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.certificateId = `CERT-${timestamp}-${randomStr}`;
  }
  
  // Calculate grade based on final score
  if (this.finalScore !== null && !this.grade) {
    if (this.finalScore >= 95) this.grade = 'A+';
    else if (this.finalScore >= 90) this.grade = 'A';
    else if (this.finalScore >= 85) this.grade = 'B+';
    else if (this.finalScore >= 80) this.grade = 'B';
    else if (this.finalScore >= 75) this.grade = 'C+';
    else if (this.finalScore >= 70) this.grade = 'C';
    else this.grade = 'Pass';
  }
  
  next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
