import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import PracticeSubmission from '../models/PracticeSubmission.js';
import { getPagination, formatUserResponse } from '../utils/helpers.js';

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, isActive } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('enrolledCourses', 'title category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const enrollments = await Enrollment.find({ user: user._id })
      .populate('course', 'title category');

    const submissions = await PracticeSubmission.find({ user: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: formatUserResponse(user),
        enrollments,
        practiceStats: {
          totalSubmissions: submissions.length,
          correctSubmissions: submissions.filter(s => s.status === 'correct').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/admin/users/:userId
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const { role, isActive, isEmailVerified } = req.body;

    const fieldsToUpdate = {};
    if (role) fieldsToUpdate.role = role;
    if (isActive !== undefined) fieldsToUpdate.isActive = isActive;
    if (isEmailVerified !== undefined) fieldsToUpdate.isEmailVerified = isEmailVerified;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course (Admin only)
// @route   POST /api/admin/courses
// @access  Private/Admin
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (Admin only)
// @route   PUT /api/admin/courses/:courseId
// @access  Private/Admin
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (Admin only)
// @route   DELETE /api/admin/courses/:courseId
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course has enrollments
    const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
    
    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course with ${enrollmentCount} active enrollments`
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    console.log('Fetching dashboard stats...');
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const totalSubmissions = await PracticeSubmission.countDocuments();

    console.log('Stats counts:', { totalUsers, activeUsers, totalCourses, publishedCourses });

    // Get recent users
    const recentUsers = await User.find()
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    console.log('Recent users count:', recentUsers.length);

    // Get popular courses - Remove isPublished filter to get all courses
    const popularCourses = await Course.find()
      .select('title category enrollmentCount rating')
      .sort({ enrollmentCount: -1 })
      .limit(5);

    console.log('Popular courses count:', popularCourses.length);

    // Monthly enrollments (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEnrollments = await Enrollment.aggregate([
      { $match: { enrolledAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$enrolledAt' },
            month: { $month: '$enrolledAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const stats = {
      overview: {
        totalUsers,
        activeUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalSubmissions
      },
      recentUsers,
      popularCourses,
      monthlyEnrollments
    };

    console.log('Sending stats response:', JSON.stringify(stats, null, 2));

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrollments (Admin only)
// @route   GET /api/admin/enrollments
// @access  Private/Admin
export const getAllEnrollments = async (req, res, next) => {
  try {
    const { page, limit, status, courseId } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const query = {};
    if (status) query.status = status;
    if (courseId) query.course = courseId;

    const enrollments = await Enrollment.find(query)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title category')
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Enrollment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: enrollments.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};
