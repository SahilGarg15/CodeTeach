import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, type = 'signup') => {
  try {
    const transporter = createTransporter();

    const subject = type === 'signup' 
      ? 'Verify Your Email - Code-Teach'
      : 'Login Verification - Code-Teach';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .otp-box {
              background-color: #f0f0f0;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              margin: 20px 0;
              border-radius: 5px;
              color: #4F46E5;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
            .warning {
              color: #dc2626;
              font-size: 14px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Code-Teach</h1>
            </div>
            <div class="content">
              <h2>Email Verification</h2>
              <p>Hello,</p>
              <p>Your One-Time Password (OTP) for ${type === 'signup' ? 'account registration' : 'login'} is:</p>
              <div class="otp-box">${otp}</div>
              <p>This OTP is valid for ${process.env.OTP_EXPIRE || 10} minutes.</p>
              <p class="warning">⚠️ Do not share this OTP with anyone. Code-Teach will never ask for your OTP.</p>
              <p>If you didn't request this OTP, please ignore this email.</p>
              <p>Best regards,<br>Code-Teach Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Code-Teach. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Code-Teach" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Code-Teach! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for joining Code-Teach, your journey to mastering programming starts here!</p>
              <p>With Code-Teach, you can:</p>
              <ul>
                <li>Learn Java, C++, Data Structures & Algorithms, and Web Development</li>
                <li>Practice with interactive code examples</li>
                <li>Track your learning progress</li>
                <li>Access comprehensive course materials</li>
              </ul>
              <a href="${process.env.FRONTEND_URL}/courses" class="button">Start Learning</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Happy Learning!<br>The Code-Teach Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Code-Teach" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Welcome to Code-Teach! 🚀',
      html: html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .warning {
              color: #dc2626;
              font-size: 14px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>You requested to reset your password for your Code-Teach account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p class="warning">⚠️ If you didn't request this password reset, please ignore this email.</p>
              <p>Best regards,<br>Code-Teach Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Code-Teach" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request - Code-Teach',
      html: html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send contact form email to admin
export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const transporter = createTransporter();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .info-box {
              background-color: #f3f4f6;
              padding: 15px;
              margin: 15px 0;
              border-left: 4px solid #4F46E5;
              border-radius: 3px;
            }
            .info-label {
              font-weight: bold;
              color: #4F46E5;
              margin-bottom: 5px;
            }
            .message-box {
              background-color: #f9fafb;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
              border: 1px solid #e5e7eb;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <h2>Contact Form Details</h2>
              
              <div class="info-box">
                <div class="info-label">From:</div>
                <div>${name}</div>
              </div>
              
              <div class="info-box">
                <div class="info-label">Email:</div>
                <div><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="info-box">
                <div class="info-label">Subject:</div>
                <div>${subject}</div>
              </div>
              
              <div class="info-box">
                <div class="info-label">Date:</div>
                <div>${new Date().toLocaleString()}</div>
              </div>
              
              <div style="margin-top: 30px;">
                <div class="info-label">Message:</div>
                <div class="message-box">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <strong>To reply:</strong> Simply respond to <a href="mailto:${email}">${email}</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Code-Teach. All rights reserved.</p>
              <p>This is an automated message from your Code-Teach contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Code-Teach Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin email
      replyTo: email, // Allow direct reply to the sender
      subject: `[Contact Form] ${subject}`,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send contact form email');
  }
};
