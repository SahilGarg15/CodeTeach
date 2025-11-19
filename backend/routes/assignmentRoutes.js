import express from 'express';
import {
  getCourseAssignments,
  getAssignment,
  submitAssignment,
  getSubmission,
  getMySubmissions,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  gradeSubmission,
  getAssignmentSubmissions
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Student routes
router.get('/course/:courseId', getCourseAssignments);
router.get('/course/:courseId/my-submissions', getMySubmissions);
router.get('/:id', getAssignment);
router.post('/:id/submit', submitAssignment);
router.get('/submissions/:submissionId', getSubmission);

// Admin routes
router.post('/', authorize('admin'), createAssignment);
router.put('/:id', authorize('admin'), updateAssignment);
router.delete('/:id', authorize('admin'), deleteAssignment);
router.get('/:id/submissions', authorize('admin'), getAssignmentSubmissions);
router.post('/submissions/:submissionId/grade', authorize('admin'), gradeSubmission);

export default router;
