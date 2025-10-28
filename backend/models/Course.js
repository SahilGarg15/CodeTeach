import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please provide course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide course description']
  },
  category: {
    type: String,
    required: true,
    enum: ['Java', 'Cpp', 'DSA', 'WebDev'],
    default: 'Java'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  thumbnail: {
    type: String,
    default: null
  },
  duration: {
    type: String, // e.g., "10 hours", "5 weeks"
    default: null
  },
  language: {
    type: String,
    default: 'English'
  },
  prerequisites: [{
    type: String
  }],
  learningOutcomes: [{
    type: String
  }],
  modules: [{
    moduleId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    order: {
      type: Number,
      required: true
    },
    topics: [{
      topicId: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: String,
      order: {
        type: Number,
        required: true
      },
      componentPath: String, // Path to the React component
      estimatedTime: String, // e.g., "30 mins"
      hasPractice: {
        type: Boolean,
        default: false
      }
    }]
  }],
  instructor: {
    name: String,
    bio: String,
    avatar: String
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
courseSchema.index({ courseId: 1 });
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);

export default Course;
