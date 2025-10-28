import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import { formatUserResponse } from '../utils/helpers.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses', 'title category thumbnail level');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, dateOfBirth, bio, avatar } = req.body;

    const fieldsToUpdate = {};
    if (firstName) fieldsToUpdate.firstName = firstName;
    if (lastName) fieldsToUpdate.lastName = lastName;
    if (phoneNumber) fieldsToUpdate.phoneNumber = phoneNumber;
    if (dateOfBirth) fieldsToUpdate.dateOfBirth = dateOfBirth;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user enrollments
// @route   GET /api/users/enrollments
// @access  Private
export const getUserEnrollments = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate('course', 'title description category level thumbnail duration')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id });

    const stats = {
      totalCourses: enrollments.length,
      activeCourses: enrollments.filter(e => e.status === 'active').length,
      completedCourses: enrollments.filter(e => e.status === 'completed').length,
      averageProgress: enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
        : 0,
      totalTimeSpent: 0, // Can be calculated from Progress model if needed
      joinedDate: req.user.createdAt
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public user profile (for viewing other users)
// @route   GET /api/users/:userId
// @access  Public
export const getPublicUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('firstName lastName avatar bio createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const enrollments = await Enrollment.find({ 
      user: user._id, 
      status: 'completed' 
    }).countDocuments();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
        joinedDate: user.createdAt,
        completedCourses: enrollments
      }
    });
  } catch (error) {
    next(error);
  }
};
