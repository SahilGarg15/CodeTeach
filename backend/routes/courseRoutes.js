import express from 'express';
import {
  getAllCourses,
  getCourseById,
  getCourseByCourseId,
  getCourseContent,
  getCourseCategories,
  getPopularCourses,
  searchCourses
} from '../controllers/courseController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { enrollInCourse } from '../controllers/enrollmentController.js';
import { getUserEnrollments } from '../controllers/userController.js';
import { getCourseProgress } from '../controllers/progressController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/categories/list', getCourseCategories);
router.get('/popular/list', getPopularCourses);
router.get('/search', searchCourses);

// Protected routes - Must come before /:id to avoid route conflicts
router.get('/enrolled', protect, getUserEnrollments); // GET /api/courses/enrolled
router.post('/enroll/:courseId', protect, enrollInCourse); // POST /api/courses/enroll/:courseId
router.get('/progress/:courseId', protect, getCourseProgress); // GET /api/courses/progress/:courseId

// Public routes with dynamic parameters (must come after specific routes)
router.get('/code/:courseId', optionalAuth, getCourseByCourseId);
router.get('/:id', optionalAuth, getCourseById);

// Protected routes
router.get('/:id/content', protect, getCourseContent);

export default router;
