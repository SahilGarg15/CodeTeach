import crypto from 'crypto';

// Generate random OTP
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

// Generate random string
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Calculate OTP expiration time
export const getOTPExpirationTime = () => {
  const minutes = parseInt(process.env.OTP_EXPIRE) || 10;
  return new Date(Date.now() + minutes * 60 * 1000);
};

// Format user response (remove sensitive data)
export const formatUserResponse = (user) => {
  return {
    id: user._id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    fullName: user.fullName || '',
    email: user.email,
    role: user.role || 'user',
    isAdmin: user.role === 'admin', // Add isAdmin for backward compatibility
    avatar: user.avatar,
    phoneNumber: user.phoneNumber,
    dateOfBirth: user.dateOfBirth,
    bio: user.bio,
    isEmailVerified: user.isEmailVerified,
    enrolledCourses: user.enrolledCourses,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt
  };
};

// Send token response
export const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: formatUserResponse(user)
  });
};

// Pagination helper
export const getPagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

// Calculate progress percentage
export const calculateProgress = (completedTopics, totalTopics) => {
  if (totalTopics === 0) return 0;
  return Math.round((completedTopics / totalTopics) * 100);
};
