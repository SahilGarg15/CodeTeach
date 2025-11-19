import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reported: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
reviewSchema.index({ course: 1, user: 1 }, { unique: true }); // One review per user per course
reviewSchema.index({ course: 1, rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Static method to calculate average rating for a course
reviewSchema.statics.calculateAverageRating = async function(courseId) {
  const stats = await this.aggregate([
    { $match: { course: mongoose.Types.ObjectId(courseId), isApproved: true } },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratings: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        averageRating: { $round: ['$averageRating', 1] },
        totalReviews: 1,
        ratingDistribution: {
          5: {
            $size: {
              $filter: {
                input: '$ratings',
                as: 'rating',
                cond: { $eq: ['$$rating', 5] }
              }
            }
          },
          4: {
            $size: {
              $filter: {
                input: '$ratings',
                as: 'rating',
                cond: { $eq: ['$$rating', 4] }
              }
            }
          },
          3: {
            $size: {
              $filter: {
                input: '$ratings',
                as: 'rating',
                cond: { $eq: ['$$rating', 3] }
              }
            }
          },
          2: {
            $size: {
              $filter: {
                input: '$ratings',
                as: 'rating',
                cond: { $eq: ['$$rating', 2] }
              }
            }
          },
          1: {
            $size: {
              $filter: {
                input: '$ratings',
                as: 'rating',
                cond: { $eq: ['$$rating', 1] }
              }
            }
          }
        }
      }
    }
  ]);

  return stats[0] || { averageRating: 0, totalReviews: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
};

// Update course rating after save
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.course);
});

// Update course rating after remove
reviewSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.course);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
