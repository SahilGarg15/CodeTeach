import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserEnrollments,
  getUserStats,
  deleteUserAccount,
  getPublicUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { updateProfileValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/:userId', getPublicUserProfile);

// Protected routes
router.get('/profile/me', protect, getUserProfile);
router.put('/profile/me', protect, updateProfileValidation, validate, updateUserProfile);
router.get('/enrollments/me', protect, getUserEnrollments);
router.get('/stats/me', protect, getUserStats);
router.delete('/account/me', protect, deleteUserAccount);

export default router;
