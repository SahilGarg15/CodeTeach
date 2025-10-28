# Code-Teach Backend API

Complete backend server for Code-Teach learning platform with MongoDB, JWT authentication, OTP verification, and comprehensive course management.

## Features

- ✅ User Authentication with OTP (Signup & Login)
- ✅ JWT Token-based Authorization
- ✅ Password Encryption with bcrypt
- ✅ Email Service with Nodemailer
- ✅ Course Management System
- ✅ Enrollment & Progress Tracking
- ✅ Practice Problem Submissions
- ✅ Admin Dashboard & Management
- ✅ MongoDB Database Integration
- ✅ Input Validation & Error Handling
- ✅ CORS Enabled
- ✅ Cookie-based Session Management

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: CORS, Cookie Parser

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account for sending emails (or other SMTP service)

### Setup Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   
   - Update the `.env` file with your credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/code-teach
   # Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/code-teach
   
   # JWT
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   
   # Email (Gmail Example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   EMAIL_FROM=noreply@codeteach.com
   
   # OTP Configuration
   OTP_EXPIRE=10
   OTP_LENGTH=6
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Setup Gmail App Password (for email functionality):**
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password
   - Use that password in `EMAIL_PASSWORD`

5. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

6. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user (sends OTP) | Public |
| POST | `/verify-otp` | Verify OTP and complete registration | Public |
| POST | `/resend-otp` | Resend OTP | Public |
| POST | `/login` | Login user (sends OTP) | Public |
| POST | `/verify-login-otp` | Verify login OTP | Public |
| GET | `/me` | Get current user | Private |
| POST | `/logout` | Logout user | Private |
| POST | `/forgot-password` | Request password reset | Public |
| PUT | `/reset-password/:token` | Reset password | Public |
| PUT | `/update-password` | Update password | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile/me` | Get user profile | Private |
| PUT | `/profile/me` | Update user profile | Private |
| GET | `/enrollments/me` | Get user enrollments | Private |
| GET | `/stats/me` | Get user statistics | Private |
| DELETE | `/account/me` | Delete user account | Private |
| GET | `/:userId` | Get public user profile | Public |

### Course Routes (`/api/courses`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all courses | Public |
| GET | `/categories/list` | Get course categories | Public |
| GET | `/popular/list` | Get popular courses | Public |
| GET | `/search` | Search courses | Public |
| GET | `/code/:courseId` | Get course by courseId | Public |
| GET | `/:id` | Get course by ID | Public |
| GET | `/:id/content` | Get course content | Private |

### Enrollment Routes (`/api/enrollments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Enroll in course | Private |
| GET | `/course/:courseId` | Get enrollment by course | Private |
| PUT | `/:enrollmentId/status` | Update enrollment status | Private |
| POST | `/:enrollmentId/complete-topic` | Mark topic as complete | Private |
| POST | `/:enrollmentId/rate` | Rate course | Private |
| DELETE | `/:enrollmentId` | Unenroll from course | Private |
| GET | `/:enrollmentId/stats` | Get enrollment stats | Private |

### Progress Routes (`/api/progress`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Get overall progress stats | Private |
| GET | `/course/:courseId` | Get course progress | Private |
| POST | `/` | Update progress | Private |
| GET | `/topic/:courseId/:topicId` | Get topic progress | Private |
| GET | `/module/:courseId/:moduleId` | Get module progress | Private |
| DELETE | `/:progressId` | Delete progress | Private |

### Practice Routes (`/api/practice`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/submit` | Submit practice solution | Private |
| GET | `/course/:courseId` | Get course submissions | Private |
| GET | `/stats/:courseId` | Get practice statistics | Private |
| GET | `/latest/:courseId/:practiceSetId/:questionId` | Get latest submission | Private |
| GET | `/history/:courseId/:practiceSetId/:questionId` | Get submission history | Private |
| GET | `/leaderboard/:courseId` | Get practice leaderboard | Private |
| GET | `/:submissionId` | Get submission by ID | Private |
| DELETE | `/:submissionId` | Delete submission | Private |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:userId` | Get user by ID | Admin |
| PUT | `/users/:userId` | Update user | Admin |
| DELETE | `/users/:userId` | Delete user | Admin |
| POST | `/courses` | Create course | Admin |
| PUT | `/courses/:courseId` | Update course | Admin |
| DELETE | `/courses/:courseId` | Delete course | Admin |
| GET | `/enrollments` | Get all enrollments | Admin |
| GET | `/stats` | Get dashboard statistics | Admin |

## Request/Response Examples

### 1. Register User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "data": {
    "email": "john@example.com",
    "expiresIn": 10
  }
}
```

### 2. Verify OTP

**Request:**
```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "firstName": "John",
  "lastName": "Doe",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": true
  }
}
```

### 3. Login

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "data": {
    "email": "john@example.com",
    "expiresIn": 10
  }
}
```

### 4. Enroll in Course

**Request:**
```bash
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "_id": "507f191e810c19729de860ea",
    "user": "507f1f77bcf86cd799439011",
    "course": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Java Programming Fundamentals",
      "category": "Java"
    },
    "status": "active",
    "progress": 0
  }
}
```

## Database Models

### User Model
- firstName, lastName, email, password (hashed)
- role (user/admin)
- avatar, phoneNumber, dateOfBirth, bio
- isEmailVerified, isActive
- enrolledCourses[], lastLogin
- resetPasswordToken, resetPasswordExpire

### OTP Model
- email, otp, type (signup/login/reset)
- verified, attempts
- expiresAt (TTL index for auto-deletion)

### Course Model
- courseId, title, description, category
- level, thumbnail, duration, language
- prerequisites[], learningOutcomes[]
- modules[] with topics[]
- instructor info
- isPublished, isFree, price
- enrollmentCount, rating

### Enrollment Model
- user, course
- status (active/completed/paused/dropped)
- progress (0-100)
- completedTopics[], lastAccessedTopic
- rating & review

### Progress Model
- user, course, topicId, moduleId
- status, timeSpent
- lastAccessedAt, completedAt
- notes

### PracticeSubmission Model
- user, course, practiceSetId, questionId
- userCode, language, status
- score, testsPassed, totalTests
- executionTime, memoryUsed

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- HTTP-only cookies for token storage
- OTP verification with attempt limits (3 attempts)
- OTP expiration (10 minutes default)
- Password reset token expiration (1 hour)
- Input validation on all routes
- CORS configuration
- Role-based access control (user/admin)
- Account deactivation instead of hard delete

## Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development/production |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/code-teach |
| JWT_SECRET | Secret key for JWT | your_secret_key |
| JWT_EXPIRE | JWT expiration time | 7d |
| JWT_COOKIE_EXPIRE | Cookie expiration (days) | 7 |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email username | your-email@gmail.com |
| EMAIL_PASSWORD | Email password/app password | your-app-password |
| EMAIL_FROM | From email address | noreply@codeteach.com |
| OTP_EXPIRE | OTP expiration (minutes) | 10 |
| OTP_LENGTH | OTP length | 6 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## Testing

Test the API using tools like:
- Postman
- Thunder Client (VS Code Extension)
- cURL
- Frontend application

## Production Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Set strong `JWT_SECRET`
4. Configure production email service
5. Update `FRONTEND_URL` to production domain
6. Enable HTTPS
7. Set up process manager (PM2)
8. Configure reverse proxy (Nginx)

## Common Issues & Solutions

### Email not sending
- Enable 2-factor authentication on Gmail
- Generate App Password
- Check firewall settings for port 587

### MongoDB connection error
- Ensure MongoDB is running
- Check connection string format
- Verify network access (MongoDB Atlas)

### JWT token expired
- Token expires based on JWT_EXPIRE setting
- User needs to login again
- Implement refresh token for better UX

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── email.js          # Email configuration & templates
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── courseController.js
│   ├── enrollmentController.js
│   ├── progressController.js
│   ├── practiceController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js           # Authentication & authorization
│   ├── errorHandler.js   # Global error handler
│   └── validation.js     # Input validation rules
├── models/
│   ├── User.js
│   ├── OTP.js
│   ├── Course.js
│   ├── Enrollment.js
│   ├── Progress.js
│   └── PracticeSubmission.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   ├── enrollmentRoutes.js
│   ├── progressRoutes.js
│   ├── practiceRoutes.js
│   └── adminRoutes.js
├── utils/
│   └── helpers.js        # Utility functions
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js             # Entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Create an issue in the repository
- Contact: support@codeteach.com

## Changelog

### Version 1.0.0
- Initial release
- Complete authentication system with OTP
- Course management
- Progress tracking
- Practice submissions
- Admin dashboard
