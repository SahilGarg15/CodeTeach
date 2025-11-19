import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book } from 'lucide-react';
import config, { apiRequest, setAuthToken, setUser } from '../../../config/config';
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [resetStep, setResetStep] = useState('email'); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const inputClassName = "w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors";
  const labelClassName = "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1";

  const validateForm = () => {
    // Password validation
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }

    // Additional validation for signup
    if (!isLogin) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
      }

      if (username.length < 3) {
        alert('Username must be at least 3 characters long');
        return false;
      }

      // Username format validation
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        alert('Username can only contain letters, numbers, underscores and hyphens');
        return false;
      }
    }

    return true;
  };

  const onAuthSuccess = () => {
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect') || '/learning-dashboard';
    navigate(redirectUrl);
  };

  const handleLogin = async (values) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.signin}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Backend sends OTP for login verification
      setIsVerifying(true);
      alert('Verification code sent to your email');
      
    } catch (error) {
      console.error('Login error:', error);
      setVerificationError(error.message || 'Login failed');
      alert(error.message || 'Login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerificationError('');
    
    if (!validateForm()) {
      return;
    }

    if (isLogin) {
      handleLogin({ email, password });
      return;
    }

    // Signup validation
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.signup}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store sessionId received from server
      setSessionId(data.sessionId);
      setIsVerifying(true);
      
    } catch (error) {
      console.error('Auth error:', error);
      setVerificationError(error.message || 'An unexpected error occurred');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setVerificationError('');
    
    try {
      let endpoint, body;
      
      if (isForgotPassword) {
        // Password reset flow
        endpoint = config.api.endpoints.auth.resetPassword;
        body = { email, otp, newPassword: password };
      } else if (isLogin) {
        // Login OTP verification
        endpoint = config.api.endpoints.auth.verifyLoginOtp;
        body = { email, otp };
      } else {
        // Signup email verification
        endpoint = config.api.endpoints.auth.verifyEmail;
        body = { email, otp, sessionId, password, username };
      }

      const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (isForgotPassword) {
        alert('Password reset successful! Please login with your new password.');
        setIsForgotPassword(false);
        setIsVerifying(false);
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setOtp('');
      } else {
        // Login or signup successful
        console.log('Received data from backend:', data);
        console.log('Token:', data.token);
        console.log('User:', data.user);
        
        // Save to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Verify data was saved
        console.log('Token saved:', localStorage.getItem('token'));
        console.log('User saved:', localStorage.getItem('user'));
        
        // Small delay to ensure localStorage is written
        setTimeout(() => {
          // Redirect based on user role
          if (data.user.role === 'admin') {
            console.log('Redirecting to /admin');
            window.location.href = '/admin';
          } else {
            console.log('Redirecting to learning dashboard');
            const params = new URLSearchParams(location.search);
            const redirectUrl = params.get('redirect') || '/learning-dashboard';
            window.location.href = redirectUrl;
          }
        }, 100);
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError(error.message || 'Verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      // Determine the OTP type based on current flow
      const type = isForgotPassword ? 'password-reset' : (isLogin ? 'login' : 'signup');
      
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.resendOtp}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      alert('New verification code sent to your email');
      
    } catch (error) {
      console.error('Resend error:', error);
      alert(error.message || 'Failed to resend verification code');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(config.api.endpoints.auth.forgotPassword, {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      setResetStep('otp');
      alert('Password reset code sent to your email');
    } catch (error) {
      console.error('Forgot password error:', error);
      alert(error.message || 'Failed to process forgot password request');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetStep === 'otp') {
      try {
        await apiRequest(config.api.endpoints.auth.verifyResetOtp, {
          method: 'POST',
          body: JSON.stringify({ email, otp })
        });
        setResetStep('newPassword');
      } catch (error) {
        alert(error.message || 'Invalid reset code');
      }
      return;
    }

    if (resetStep === 'newPassword') {
      if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match');
        return;
      }

      try {
        await apiRequest(config.api.endpoints.auth.resetPassword, {
          method: 'POST',
          body: JSON.stringify({ 
            email, 
            otp,
            newPassword 
          })
        });

        alert('Password reset successful! Please login with your new password.');
        setIsForgotPassword(false);
        setResetStep('email');
        setIsLogin(true);
      } catch (error) {
        alert(error.message || 'Failed to reset password');
      }
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto h-16 w-16 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center mb-6"
          >
            <Book className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Reset Password
          </h2>

          {resetStep === 'email' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className={labelClassName}>Email address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className={inputClassName}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-colors"
              >
                Send Reset Code
              </button>
            </form>
          )}

          {resetStep === 'otp' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className={labelClassName}>Verification Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter verification code"
                  className={inputClassName}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-colors"
              >
                Verify Code
              </button>
            </form>
          )}

          {resetStep === 'newPassword' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className={labelClassName}>New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  className={inputClassName}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClassName}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  className={inputClassName}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-colors"
              >
                Reset Password
              </button>
            </form>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => {
                if (resetStep === 'otp') {
                  handleResendOTP();
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {resetStep === 'otp' && "Resend code"}
            </button>
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setResetStep('email');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            {isLogin ? 'Verify Login' : 'Verify Your Email'}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            We've sent a verification code to {email}
          </p>
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <input
              type="text"
              required
              placeholder="Enter verification code"
              className={`${inputClassName} ${verificationError ? 'border-red-500' : ''}`}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            {verificationError && (
              <p className="text-red-500 text-sm mt-1">{verificationError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              {isLogin ? 'Verify & Login' : 'Verify Email'}
            </button>
          </form>
          <div className="mt-4 space-y-4">
            <button
              onClick={handleResendOTP}
              className="w-full text-blue-600 hover:text-blue-700 text-sm"
            >
              Resend verification code
            </button>
            <button
              onClick={() => {
                setIsVerifying(false);
                setVerificationError('');
                setOtp('');
              }}
              className="w-full text-gray-600 hover:text-gray-700 text-sm"
            >
              {isLogin ? 'Go back to login' : 'Go back to signup'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto h-16 w-16 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center mb-6"
        >
          <Book className="h-8 w-8 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100"
        >
          {isLogin ? 'Welcome Back!' : 'Join Us Today'}
        </motion.h2>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-8">
          {isLogin 
            ? 'Continue your learning journey'
            : 'Begin your path to mastery'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className={labelClassName}>Username</label>
                <input
                  type="text"
                  required
                  placeholder="Choose a username"
                  className={inputClassName}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  pattern="[a-zA-Z0-9_\-]+"
                  title="Username can only contain letters, numbers, underscores and hyphens"
                />
              </motion.div>
            )}

            <div>
              <label className={labelClassName}>Email address</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className={inputClassName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClassName}>Password</label>
              <input
                type="password"
                required
                placeholder={isLogin ? "Enter password" : "Choose password"}
                className={inputClassName}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div>
                <label className={labelClassName}>Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm your password"
                  className={inputClassName}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            )}
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Forgot password?
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-lg shadow-lg transition-all duration-300"
          >
            {isLogin ? 'Sign in' : 'Sign up'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
