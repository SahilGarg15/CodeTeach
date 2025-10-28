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

// Dashboard statistics
router.get('/stats', getDashboardStats);

export default router;
