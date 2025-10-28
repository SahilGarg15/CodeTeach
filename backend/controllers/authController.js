import User from '../models/User.js';
import OTP from '../models/OTP.js';
import crypto from 'crypto';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../config/email.js';
import { generateOTP, getOTPExpirationTime, formatUserResponse, sendTokenResponse } from '../utils/helpers.js';

// @desc    Register user (Send OTP)
// @route   POST /auth/signup
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email, type: 'signup' });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpirationTime();

    // Save OTP to database
    const otpRecord = await OTP.create({
      email,
      otp,
      type: 'signup',
      expiresAt
    });

    // Send OTP email
    await sendOTPEmail(email, otp, 'signup');

    // Store user data temporarily (you might want to use Redis for this in production)
    // For now, we'll send back a sessionId that the frontend can use
    const sessionId = otpRecord._id.toString();

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      sessionId, // Frontend expects this
      data: {
        email,
        expiresIn: process.env.OTP_EXPIRE || 10
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and complete registration
// @route   POST /auth/verify-email
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, password, firstName, lastName, username, sessionId } = req.body;

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      type: 'signup',
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check OTP attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - otpRecord.attempts
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Create user
    const user = await User.create({
      email,
      password,
      firstName: firstName || username || email.split('@')[0],
      lastName: lastName || '',
      isEmailVerified: true
    });

    // Send welcome email
    await sendWelcomeEmail(email, user.firstName);

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res, next) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({
        success: false,
        message: 'Email and type are required'
      });
    }

    // Delete existing OTPs
    await OTP.deleteMany({ email, type });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpirationTime();

    // Save OTP
    await OTP.create({
      email,
      otp,
      type,
      expiresAt
    });

    // Send OTP email
    await sendOTPEmail(email, otp, type);

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email',
      expiresIn: process.env.OTP_EXPIRE || 10
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Send OTP)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Delete any existing login OTPs
    await OTP.deleteMany({ email, type: 'login' });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpirationTime();

    // Save OTP
    await OTP.create({
      email,
      otp,
      type: 'login',
      expiresAt
    });

    // Send OTP email
    await sendOTPEmail(email, otp, 'login');

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      data: {
        email,
        expiresIn: process.env.OTP_EXPIRE || 10
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify login OTP
// @route   POST /api/auth/verify-login-otp
// @access  Public
export const verifyLoginOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      type: 'login',
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check OTP attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts exceeded. Please try logging in again.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - otpRecord.attempts
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses', 'title category thumbnail');

    res.status(200).json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password (Send reset token)
// @route   POST /auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    // Delete any existing reset OTPs
    await OTP.deleteMany({ email, type: 'reset' });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpirationTime();

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      type: 'reset',
      expiresAt
    });

    // Send OTP email
    await sendOTPEmail(email, otp, 'reset');

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
      data: {
        email,
        expiresIn: process.env.OTP_EXPIRE || 10
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      type: 'reset',
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check OTP attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - otpRecord.attempts
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify reset password OTP
// @route   POST /auth/verify-reset-otp
// @access  Public
export const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      type: 'reset',
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check OTP attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - otpRecord.attempts
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
