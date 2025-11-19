import express from 'express';
import {
  getCourseQuizzes,
  getQuiz,
  startQuizAttempt,
  submitAnswer,
  completeQuizAttempt,
  getAttemptResults,
  getMyAttempts,
  createQuiz,
  updateQuiz,
  deleteQuiz
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Student routes
router.get('/course/:courseId', getCourseQuizzes);
router.get('/course/:courseId/my-attempts', getMyAttempts);
router.get('/:id', getQuiz);
router.post('/:id/start', startQuizAttempt);
router.post('/attempts/:attemptId/answer', submitAnswer);
router.post('/attempts/:attemptId/complete', completeQuizAttempt);
router.get('/attempts/:attemptId', getAttemptResults);

// Admin routes
router.post('/', authorize('admin'), createQuiz);
router.put('/:id', authorize('admin'), updateQuiz);
router.delete('/:id', authorize('admin'), deleteQuiz);

export default router;
