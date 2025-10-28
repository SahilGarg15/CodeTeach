import { body, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules for registration
export const registerValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_\-]+$/).withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation rules for login
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Validation rules for OTP verification
export const otpValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must contain only numbers')
];

// Validation rules for password reset request
export const resetPasswordRequestValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Validation rules for password reset
export const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation rules for profile update
export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('phoneNumber')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Please provide a valid date')
];

// Validation rules for course creation
export const createCourseValidation = [
  body('courseId')
    .trim()
    .notEmpty().withMessage('Course ID is required'),
  
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Course description is required'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Java', 'Cpp', 'DSA', 'WebDev']).withMessage('Invalid category'),
  
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level')
];

// Validation rules for enrollment
export const enrollmentValidation = [
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID')
];

// Validation rules for progress update
export const progressValidation = [
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID'),
  
  body('topicId')
    .notEmpty().withMessage('Topic ID is required'),
  
  body('moduleId')
    .notEmpty().withMessage('Module ID is required'),
  
  body('status')
    .optional()
    .isIn(['not-started', 'in-progress', 'completed']).withMessage('Invalid status')
];

// Validation rules for practice submission
export const practiceSubmissionValidation = [
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID'),
  
  body('practiceSetId')
    .notEmpty().withMessage('Practice set ID is required'),
  
  body('questionId')
    .notEmpty().withMessage('Question ID is required'),
  
  body('userCode')
    .notEmpty().withMessage('User code is required'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['correct', 'incorrect', 'partial']).withMessage('Invalid status')
];
