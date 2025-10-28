import express from 'express';
import {
  getCourseProgress,
  updateProgress,
  getTopicProgress,
  getOverallProgressStats,
  deleteProgress,
  getModuleProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
import { progressValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/stats', getOverallProgressStats);
router.get('/course/:courseId', getCourseProgress);
router.post('/', progressValidation, validate, updateProgress);
router.get('/topic/:courseId/:topicId', getTopicProgress);
router.get('/module/:courseId/:moduleId', getModuleProgress);
router.delete('/:progressId', deleteProgress);

export default router;
