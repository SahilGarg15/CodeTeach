import express from 'express';
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  verifyLoginOTP,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  verifyResetOTP,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  otpValidation,
  resetPasswordRequestValidation,
  resetPasswordValidation,
  validate
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', registerValidation, validate, register); // Changed from /register to /signup
router.post('/verify-email', otpValidation, validate, verifyOTP); // Changed from /verify-otp to /verify-email
router.post('/resend-otp', resendOTP);
router.post('/signin', loginValidation, validate, login); // Changed from /login to /signin
router.post('/verify-login-otp', otpValidation, validate, verifyLoginOTP);
router.post('/forgot-password', resetPasswordRequestValidation, validate, forgotPassword);
router.post('/verify-reset-otp', otpValidation, validate, verifyResetOTP); // New endpoint for frontend
router.post('/reset-password', resetPasswordValidation, validate, resetPassword); // Changed from PUT /:resetToken to POST

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);

export default router;
