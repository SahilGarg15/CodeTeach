import express from 'express';
import {
  submitPractice,
  getCourseSubmissions,
  getSubmissionById,
  getPracticeStats,
  getLatestSubmission,
  getQuestionSubmissionHistory,
  deleteSubmission,
  getPracticeLeaderboard
} from '../controllers/practiceController.js';
import { protect } from '../middleware/auth.js';
import { practiceSubmissionValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/submit', practiceSubmissionValidation, validate, submitPractice);
router.get('/course/:courseId', getCourseSubmissions);
router.get('/stats/:courseId', getPracticeStats);
router.get('/latest/:courseId/:practiceSetId/:questionId', getLatestSubmission);
router.get('/history/:courseId/:practiceSetId/:questionId', getQuestionSubmissionHistory);
router.get('/leaderboard/:courseId', getPracticeLeaderboard);
router.get('/:submissionId', getSubmissionById);
router.delete('/:submissionId', deleteSubmission);

export default router;
