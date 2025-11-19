import express from 'express';
import {
  getCourseDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  updateReply,
  deleteReply,
  upvoteDiscussion,
  upvoteReply,
  acceptReply,
  closeDiscussion
} from '../controllers/discussionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/course/:courseId', getCourseDiscussions);
router.get('/:id', getDiscussion);

// Protected routes
router.use(protect);

router.post('/course/:courseId', createDiscussion);
router.put('/:id', updateDiscussion);
router.delete('/:id', deleteDiscussion);

// Reply routes
router.post('/:id/reply', addReply);
router.put('/:id/reply/:replyId', updateReply);
router.delete('/:id/reply/:replyId', deleteReply);

// Voting and actions
router.post('/:id/upvote', upvoteDiscussion);
router.post('/:id/reply/:replyId/upvote', upvoteReply);
router.post('/:id/reply/:replyId/accept', acceptReply);
router.post('/:id/close', closeDiscussion);

export default router;
