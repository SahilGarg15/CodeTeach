import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { getPagination } from '../utils/helpers.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res, next) => {
  try {
    const { page, limit, category, level, search, sort } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    // Build query
    const query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (level) {
      query.level = level;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { enrollmentCount: -1 };
    } else if (sort === 'rating') {
      sortOption = { 'rating.average': -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    }

    const courses = await Course.find(query)
      .select('-modules') // Exclude modules for list view
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This course is not available'
      });
    }

    // If user is authenticated, check enrollment status
    let isEnrolled = false;
    let enrollment = null;
    
    if (req.user) {
      enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: course._id
      });
      isEnrolled = !!enrollment;
    }

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        isEnrolled,
        enrollmentProgress: enrollment ? enrollment.progress : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course by courseId (string identifier)
// @route   GET /api/courses/code/:courseId
// @access  Public
export const getCourseByCourseId = async (req, res, next) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'This course is not available'
      });
    }

    // If user is authenticated, check enrollment status
    let isEnrolled = false;
    let enrollment = null;
    
    if (req.user) {
      enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: course._id
      });
      isEnrolled = !!enrollment;
    }

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        isEnrolled,
        enrollmentProgress: enrollment ? enrollment.progress : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course modules and topics
// @route   GET /api/courses/:id/content
// @access  Private (must be enrolled)
export const getCourseContent = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).select('modules title');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: course._id
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must enroll in this course to access content'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        title: course.title,
        modules: course.modules,
        completedTopics: enrollment.completedTopics,
        lastAccessedTopic: enrollment.lastAccessedTopic
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course categories
// @route   GET /api/courses/categories/list
// @access  Public
export const getCourseCategories = async (req, res, next) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Course.countDocuments({ category, isPublished: true });
        return { name: category, count };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular courses
// @route   GET /api/courses/popular/list
// @access  Public
export const getPopularCourses = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const courses = await Course.find({ isPublished: true })
      .select('-modules')
      .sort({ enrollmentCount: -1, 'rating.average': -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search courses
// @route   GET /api/courses/search
// @access  Public
export const searchCourses = async (req, res, next) => {
  try {
    const { q, category, level } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const query = {
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .select('-modules')
      .limit(20);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};
