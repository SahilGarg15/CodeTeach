import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createCourse,
  updateCourse,
  deleteCourse,
  getDashboardStats,
  getAllEnrollments
} from '../controllers/adminController.js';
import Certificate from '../models/Certificate.js';
import Discussion from '../models/Discussion.js';
import { protect, authorize } from '../middleware/auth.js';
import { createCourseValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

// Course management
router.post('/courses', createCourseValidation, validate, createCourse);
router.put('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);

// Enrollment management
router.get('/enrollments', getAllEnrollments);

// Certificate management
router.get('/certificates', async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
      .populate('user', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ issuedDate: -1 });
    
    res.status(200).json({
      success: true,
      data: certificates
    });
  } catch (error) {
    next(error);
  }
});

// Discussion management
router.get('/discussions', async (req, res, next) => {
  try {
    const discussions = await Discussion.find()
      .populate('author', 'firstName lastName email')
      .populate('course', 'title')
      .populate('replies.author', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: discussions
    });
  } catch (error) {
    next(error);
  }
});

// Dashboard statistics
router.get('/stats', getDashboardStats);

export default router;
