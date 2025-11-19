import express from 'express';
import {
  getCourseReviews,
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/course/:courseId', getCourseReviews);

// Protected routes
router.use(protect);

router.get('/course/:courseId/my-review', getMyReview);
router.post('/course/:courseId', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markReviewHelpful);
router.post('/:id/report', reportReview);

export default router;
