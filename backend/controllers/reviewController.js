import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { getPagination } from '../utils/helpers.js';

// @desc    Get all reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
export const getCourseReviews = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'rating-high') {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === 'rating-low') {
      sortOption = { rating: 1, createdAt: -1 };
    } else if (sort === 'helpful') {
      sortOption = { 'helpful.length': -1 };
    }

    const reviews = await Review.find({
      course: req.params.courseId,
      isApproved: true
    })
      .populate('user', 'firstName lastName avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Review.countDocuments({
      course: req.params.courseId,
      isApproved: true
    });

    // Get rating statistics
    const stats = await Review.calculateAverageRating(req.params.courseId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      stats,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's review for a course
// @route   GET /api/reviews/course/:courseId/my-review
// @access  Private
export const getMyReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      course: req.params.courseId,
      user: req.user.id
    }).populate('user', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews/course/:courseId
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;

    // Check if course exists
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to leave a review'
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      course: req.params.courseId,
      rating,
      title,
      comment,
      isVerifiedPurchase: true
    });

    await review.populate('user', 'firstName lastName avatar');

    // Update course rating
    const stats = await Review.calculateAverageRating(req.params.courseId);
    await Course.findByIdAndUpdate(req.params.courseId, {
      'rating.average': stats.averageRating,
      'rating.count': stats.totalReviews
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, title, comment } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, title, comment },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName avatar');

    // Update course rating
    const stats = await Review.calculateAverageRating(review.course);
    await Course.findByIdAndUpdate(review.course, {
      'rating.average': stats.averageRating,
      'rating.count': stats.totalReviews
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const courseId = review.course;
    await review.deleteOne();

    // Update course rating
    const stats = await Review.calculateAverageRating(courseId);
    await Course.findByIdAndUpdate(courseId, {
      'rating.average': stats.averageRating,
      'rating.count': stats.totalReviews
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already marked helpful
    const alreadyHelpful = review.helpful.includes(req.user.id);

    if (alreadyHelpful) {
      // Remove from helpful
      review.helpful = review.helpful.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      // Add to helpful
      review.helpful.push(req.user.id);
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyHelpful ? 'Removed from helpful' : 'Marked as helpful',
      data: {
        helpfulCount: review.helpful.length,
        isHelpful: !alreadyHelpful
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
export const reportReview = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already reported by this user
    const alreadyReported = review.reported.some(
      report => report.user.toString() === req.user.id
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    review.reported.push({
      user: req.user.id,
      reason,
      reportedAt: Date.now()
    });

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    next(error);
  }
};
