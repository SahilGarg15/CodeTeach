import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { calculateProgress } from '../utils/helpers.js';

// @desc    Enroll in a course
// @route   POST /api/courses/enroll/:courseId (or POST /api/enrollments with courseId in body)
// @access  Private
export const enrollInCourse = async (req, res, next) => {
  try {
    // Support both route param and body param for courseId
    const courseId = req.params.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'This course is not available for enrollment'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId
    });

    // Update user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: courseId }
    });

    // Increment course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course', 'title description category level thumbnail');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: populatedEnrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's enrollment in a specific course
// @route   GET /api/enrollments/course/:courseId
// @access  Private
export const getEnrollmentByCourse = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:enrollmentId/status
// @access  Private
export const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      user: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.status = status;
    
    if (status === 'completed') {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Enrollment status updated',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark topic as complete
// @route   POST /api/enrollments/:enrollmentId/complete-topic
// @access  Private
export const markTopicComplete = async (req, res, next) => {
  try {
    const { topicId, moduleId } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      user: req.user.id
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Add topic to completed topics if not already there
    if (!enrollment.completedTopics.includes(topicId)) {
      enrollment.completedTopics.push(topicId);
    }

    // Update last accessed topic
    enrollment.lastAccessedTopic = topicId;
    enrollment.lastAccessedAt = new Date();

    // Calculate progress
    const course = enrollment.course;
    let totalTopics = 0;
    course.modules.forEach(module => {
      totalTopics += module.topics.length;
    });

    enrollment.progress = calculateProgress(enrollment.completedTopics.length, totalTopics);

    // Check if course is completed
    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    // Update or create progress record
    await Progress.findOneAndUpdate(
      {
        user: req.user.id,
        course: enrollment.course._id,
        topicId: topicId
      },
      {
        moduleId: moduleId,
        status: 'completed',
        completedAt: new Date(),
        lastAccessedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Topic marked as complete',
      data: {
        progress: enrollment.progress,
        completedTopics: enrollment.completedTopics.length,
        totalTopics: totalTopics,
        isCompleted: enrollment.status === 'completed'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate and review course
// @route   POST /api/enrollments/:enrollmentId/rate
// @access  Private
export const rateCourse = async (req, res, next) => {
  try {
    const { score, review } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating score must be between 1 and 5'
      });
    }

    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      user: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const wasRated = enrollment.rating.score !== null;
    const oldScore = enrollment.rating.score;

    enrollment.rating = {
      score,
      review: review || null,
      ratedAt: new Date()
    };

    await enrollment.save();

    // Update course rating
    const course = await Course.findById(enrollment.course);
    
    if (wasRated) {
      // Update existing rating
      const totalScore = (course.rating.average * course.rating.count) - oldScore + score;
      course.rating.average = totalScore / course.rating.count;
    } else {
      // Add new rating
      const totalScore = (course.rating.average * course.rating.count) + score;
      course.rating.count += 1;
      course.rating.average = totalScore / course.rating.count;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: enrollment.rating
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from course
// @route   DELETE /api/enrollments/:enrollmentId
// @access  Private
export const unenrollFromCourse = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      user: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const courseId = enrollment.course;

    // Delete enrollment
    await enrollment.deleteOne();

    // Update user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { enrolledCourses: courseId }
    });

    // Decrement course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrollment statistics
// @route   GET /api/enrollments/:enrollmentId/stats
// @access  Private
export const getEnrollmentStats = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      user: req.user.id
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const progressRecords = await Progress.find({
      user: req.user.id,
      course: enrollment.course._id
    });

    const totalTimeSpent = progressRecords.reduce((sum, record) => sum + record.timeSpent, 0);

    const stats = {
      progress: enrollment.progress,
      completedTopics: enrollment.completedTopics.length,
      totalTopics: enrollment.course.modules.reduce((sum, module) => sum + module.topics.length, 0),
      totalTimeSpent: totalTimeSpent,
      enrolledAt: enrollment.enrolledAt,
      lastAccessedAt: enrollment.lastAccessedAt,
      status: enrollment.status
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
