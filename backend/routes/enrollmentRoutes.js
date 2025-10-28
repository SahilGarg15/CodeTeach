import express from 'express';
import {
  enrollInCourse,
  getEnrollmentByCourse,
  updateEnrollmentStatus,
  markTopicComplete,
  rateCourse,
  unenrollFromCourse,
  getEnrollmentStats
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';
import { enrollmentValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', enrollmentValidation, validate, enrollInCourse);
router.get('/course/:courseId', getEnrollmentByCourse);
router.put('/:enrollmentId/status', updateEnrollmentStatus);
router.post('/:enrollmentId/complete-topic', markTopicComplete);
router.post('/:enrollmentId/rate', rateCourse);
router.delete('/:enrollmentId', unenrollFromCourse);
router.get('/:enrollmentId/stats', getEnrollmentStats);

export default router;
