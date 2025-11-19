# 🎓 CodeTeach - Comprehensive Learning Management System

<div align="center">

![CodeTeach Logo](https://img.shields.io/badge/CodeTeach-Learning%20Platform-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

**A full-featured Learning Management System with 95+ REST APIs, interactive coding environment, automated certificate generation, and comprehensive admin controls.**

[Features](#-key-features) • [Tech Stack](#️-tech-stack) • [Quick Start](#-quick-start) • [API Reference](./PROJECT_REPORT.md) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Project Statistics](#-project-statistics)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#️-system-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#️-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Documentation Files](#-documentation-files)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CodeTeach** is an enterprise-grade Learning Management System (LMS) specifically engineered for programming education. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it delivers a comprehensive ecosystem for course creation, student engagement, progress tracking, assessment management, and automated certification.

### Why CodeTeach?

- ✅ **100% Complete** - All features fully implemented and production-ready
- 🎯 **95+ API Endpoints** - Comprehensive RESTful backend
- 📊 **13 Database Models** - Robust data architecture with proper relationships
- 💻 **50+ React Components** - Modular, reusable frontend components
- 🎓 **4 Course Tracks** - Java, C++, Data Structures & Algorithms, Web Development
- 🏆 **Automated Certification** - Certificates auto-generate upon course completion
- 🔒 **Enterprise Security** - JWT authentication, bcrypt hashing, input validation
- 🎨 **Modern UI/UX** - Dark mode, animations, responsive design
- 📧 **Email Notifications** - Automated emails for enrollments, submissions, certificates
- 🔍 **Advanced Search** - Fast search across courses, discussions, users

---

## 📊 Project Statistics

```
📦 Total Lines of Code:    50,000+
🎨 React Components:       50+
🗄️  Database Models:        13
🔌 API Endpoints:          95+
⚡ Features Implemented:   40+
👥 User Roles:             2 (Student, Admin)
📚 Course Tracks:          4
🏗️  Controllers:            14
🛣️  Route Files:            14
🎯 Completion Status:      100%
```

---

## ✨ Key Features

### 🎓 Student Features (11 Core Features)

| Feature | Description |
|---------|-------------|
| **Authentication** | OTP-based email verification, JWT sessions, password reset |
| **Course Enrollment** | Browse 4 course tracks, one-click enrollment, instant access |
| **Dynamic Course Player** | Hierarchical content (Course → Module → Topic), mixed media types |
| **Interactive Quizzes** | Timed MCQs, instant feedback, attempt tracking, passing requirements |
| **Coding Assignments** | File uploads, due dates, auto/manual grading, feedback, resubmission |
| **Practice Problems** | Difficulty levels, code editor, hints/solutions, leaderboard |
| **Progress Tracking** | Real-time calculation, visual progress bars, hours tracking |
| **Automated Certificates** | Auto-generated on completion, unique verification IDs, downloadable PDFs |
| **Discussion Forums** | Topic discussions, nested replies, voting, search/filter |
| **Reviews & Ratings** | 5-star ratings, written reviews, edit/delete capabilities |
| **Notifications** | Real-time alerts for enrollments, submissions, certificates, replies |

### 👨‍💼 Admin Features (9 Core Features)

| Feature | Description |
|---------|-------------|
| **User Management** | View all users, search/filter, promote to admin, delete accounts |
| **Course Management** | CRUD operations, publish/unpublish, statistics dashboard |
| **Quiz Management** | Create quizzes, add questions, set duration/passing scores, view attempts |
| **Assignment Management** | Create assignments, configure rubrics, grade submissions, provide feedback |
| **Practice Management** | Create practice sets, set difficulty, configure hints/solutions |
| **Certificate Management** | View issued certificates, search/filter, revoke with reasons, verification |
| **Discussion Moderation** | Monitor discussions, delete inappropriate content, search/filter |
| **Settings Panel** | 7 tabs with 50+ configurations (general, email, security, courses, features, system, advanced) |
| **Analytics Dashboard** | Real-time stats, engagement metrics, performance tracking |

---

## 🛠️ Tech Stack

### Frontend Technologies
- **React 18.3** - UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Modern icon library
- **Monaco Editor** - VS Code's code editor component
- **React Syntax Highlighter** - Code syntax highlighting
- **React Toastify** - Toast notifications
- **Axios** - HTTP client

### Backend Technologies
- **Node.js 18.x** - JavaScript runtime
- **Express.js 4.19.2** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose 8.4.0** - MongoDB ODM

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)** - Token authentication
- **bcryptjs 2.4.3** - Password hashing
- **Nodemailer 6.9.13** - Email service
- **express-validator 7.0.1** - Input validation
- **cookie-parser 1.4.6** - Cookie management
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Vite 5.2** - Build tool and dev server
- **Nodemon 3.1.0** - Auto-restart server
- **dotenv 16.4.5** - Environment variables
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🏗️ System Architecture

### Database Models (13 Total)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Authentication, profiles | email, password, role, isAdmin |
| **Course** | Course information | title, description, modules, topics |
| **Enrollment** | Student-course links | userId, courseId, enrolledAt |
| **Progress** | Learning progress | completedTopics, lastAccessed, hoursSpent |
| **Quiz** | Quiz metadata | questions, duration, passingScore |
| **QuizAttempt** | Quiz submissions | score, answers, timeTaken |
| **Assignment** | Assignment details | dueDate, points, rubric |
| **AssignmentSubmission** | Student submissions | files, grade, feedback |
| **Certificate** | Certificates | verificationId, quizAverage, assignmentAverage |
| **Discussion** | Forum posts | title, content, replies |
| **Review** | Course reviews | rating, comment, userId |
| **PracticeSubmission** | Practice solutions | code, difficulty, score |
| **Notification** | User notifications | type, message, isRead |

### API Architecture

**95+ REST API Endpoints** organized into 14 categories:

- **Authentication** (9): Signup, login, OTP verification, password reset
- **User** (4): Profile, update, change password, enrollments
- **Course** (7): CRUD, search, filter
- **Enrollment** (4): Enroll, unenroll, view, check status
- **Progress** (3): Track, update, statistics
- **Quiz** (8): CRUD, take, submit, view attempts
- **Assignment** (10): CRUD, submit, grade, feedback
- **Practice** (9): CRUD, submit, leaderboard
- **Certificate** (5): Generate, view, download, verify, revoke
- **Discussion** (11): CRUD, reply, vote, search
- **Review** (5): CRUD, view course reviews
- **Notification** (4): Get, mark read, delete
- **Contact** (1): Contact form
- **Admin** (15): User/course/certificate/discussion management

📘 **Complete API Reference**: See [PROJECT_REPORT.md](./PROJECT_REPORT.md) for detailed endpoint documentation with request/response schemas.

---

## 📁 Project Structure

```
Code-Teach-React/
├── backend/                        # Node.js + Express backend
│   ├── config/
│   │   ├── database.js             # MongoDB connection
│   │   └── email.js                # Nodemailer config
│   ├── controllers/                # Business logic (14 files)
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── quizController.js
│   │   ├── assignmentController.js
│   │   ├── practiceController.js
│   │   ├── certificateController.js
│   │   ├── discussionController.js
│   │   └── ... (7 more)
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/                     # Mongoose schemas (13 models)
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Quiz.js
│   │   └── ... (10 more)
│   ├── routes/                     # Express routes (14 files)
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── ... (12 more)
│   ├── utils/
│   │   └── helpers.js
│   ├── .env                        # Environment variables
│   ├── server.js                   # Entry point
│   └── seed.js                     # Database seeder
│
├── src/                            # React frontend
│   ├── Course Modules/             # Course content
│   │   ├── Java/
│   │   ├── Cpp/
│   │   ├── DSA/
│   │   └── WebDev/
│   ├── Frontend/
│   │   ├── Components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ThemeProvider.jsx
│   │   │   ├── NotificationCenter.jsx
│   │   │   └── Admin/
│   │   │       ├── Users.jsx
│   │   │       ├── Courses.jsx
│   │   │       ├── QuizManagement.jsx
│   │   │       ├── AssignmentManagement.jsx
│   │   │       ├── PracticeManagement.jsx
│   │   │       ├── CertificateManagement.jsx
│   │   │       └── DiscussionModeration.jsx
│   │   └── pages/
│   │       ├── home/
│   │       ├── Courses/
│   │       ├── Dashboard/
│   │       ├── DynamicCoursePage/
│   │       ├── Quiz/
│   │       ├── Assignment/
│   │       ├── Practice/
│   │       ├── Certificate/
│   │       ├── Discussion/
│   │       ├── Authentication/
│   │       └── Admin/
│   │           └── AdminPanel.jsx
│   ├── config/
│   │   ├── config.js
│   │   └── courseIds.js
│   ├── App.js
│   ├── index.js
│   └── index.css
│
├── public/
│   ├── index.html
│   └── manifest.json
│
├── package.json
├── tailwind.config.js
├── vite.config.js
├── README.md                          # This file
├── PROJECT_REPORT.md                  # Complete project documentation
├── ADMIN_AND_FEATURES_GUIDE.md        # Feature implementation guide
└── COMPLETE_IMPLEMENTATION_SUMMARY.md # Implementation checklist
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.x+ ([Download](https://nodejs.org/))
- **npm** v9.x+ (comes with Node.js)
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **SMTP Email** (Gmail or other)
- **Git**

### Installation

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/CodeTeach.git
cd CodeTeach
```

#### 2️⃣ Backend Setup

```bash
cd backend
npm install

# Create .env file (see Configuration section)
# Windows PowerShell:
Copy-Item .env.example .env
# Linux/Mac:
# cp .env.example .env
```

#### 3️⃣ Frontend Setup

```bash
cd ..
npm install
```

#### 4️⃣ Seed Database (Optional)

```bash
cd backend
node seed.js
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=codeteach_db

# JWT
JWT_SECRET=your_super_secure_random_string_at_least_32_characters
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_SERVICE=gmail

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.txt,.zip,.js,.py,.java,.cpp

# OTP
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6
```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for dev)
5. Get connection string
6. Replace `<password>` in connection string

### Gmail App Password

1. Enable 2FA in Google Account
2. Go to Security → 2-Step Verification → App passwords
3. Generate app password
4. Use in `EMAIL_PASS`

### Frontend Configuration

Update `src/config/config.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 🎯 Usage Guide

### Running the Application

#### Development Mode

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

#### Production Mode

```powershell
npm run build
cd backend
npm start
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin

### Default Admin Account

After running `node seed.js`:

```
Email: admin@codeteach.com
Password: Admin@123
```

⚠️ **Change in production!**

### Student Workflow

1. **Sign Up**: Visit `/auth`, verify OTP via email
2. **Browse**: View course catalog at `/courses`
3. **Enroll**: Click "Enroll Now" on course card
4. **Learn**: Access from dashboard, navigate modules/topics
5. **Assess**: Complete quizzes, assignments, practice problems
6. **Certificate**: Auto-generates upon course completion

### Admin Workflow

1. Login → Navigate to `/admin`
2. **Tab 1 (Users)**: Manage users, promote to admin
3. **Tab 2 (Courses)**: CRUD courses, view stats
4. **Tab 3 (Quizzes)**: Create quizzes, add questions
5. **Tab 4 (Assignments)**: Create/grade assignments
6. **Tab 5 (Practice)**: Create practice sets
7. **Tab 6 (Certificates)**: View/revoke certificates
8. **Tab 7 (Discussions)**: Moderate discussions
9. **Tab 8 (Settings)**: Configure site (7 sub-tabs)
10. **Tab 9 (Analytics)**: View platform statistics

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Quick Reference

**Authentication**
```
POST   /auth/signup          - Register new user
POST   /auth/login           - User login
POST   /auth/verify-otp      - Verify OTP code
POST   /auth/resend-otp      - Resend OTP
POST   /auth/forgot-password - Request password reset
POST   /auth/reset-password  - Reset password
GET    /auth/logout          - Logout user
GET    /auth/check           - Check auth status
GET    /auth/profile         - Get user profile
```

**Courses**
```
GET    /courses              - Get all courses
GET    /courses/:id          - Get course by ID
POST   /courses              - Create course (Admin)
PUT    /courses/:id          - Update course (Admin)
DELETE /courses/:id          - Delete course (Admin)
GET    /courses/search       - Search courses
GET    /courses/filter       - Filter courses
```

**Quizzes**
```
GET    /quiz/:courseId       - Get course quizzes
POST   /quiz                 - Create quiz (Admin)
GET    /quiz/:quizId         - Get quiz details
POST   /quiz/:quizId/attempt - Submit quiz attempt
GET    /quiz/:quizId/attempts - Get user attempts
```

**Assignments**
```
GET    /assignments/:courseId        - Get course assignments
POST   /assignments                  - Create assignment (Admin)
POST   /assignments/:id/submit       - Submit assignment
POST   /assignments/:id/grade        - Grade submission (Admin)
GET    /assignments/:id/submissions  - Get submissions (Admin)
```

**Certificates**
```
GET    /certificates                    - Get user certificates
GET    /certificates/verify/:id         - Verify certificate
POST   /certificates/generate/:courseId - Generate certificate
GET    /certificates/download/:id       - Download certificate
```

**Admin**
```
GET    /admin/stats              - Dashboard statistics
GET    /admin/users              - Get all users
DELETE /admin/users/:id          - Delete user
PUT    /admin/users/:id/promote  - Promote to admin
GET    /admin/certificates       - Get all certificates
GET    /admin/discussions        - Get all discussions
```

📘 **Complete API Documentation**: See [PROJECT_REPORT.md](./PROJECT_REPORT.md) for all 95+ endpoints with detailed schemas, request/response examples, and authentication requirements.

---

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Minimum length requirements
   - No plain text storage

2. **JWT Authentication**
   - Secure token-based sessions
   - HttpOnly cookies (XSS prevention)
   - Token expiration (7 days)
   - Refresh token rotation

3. **OTP Verification**
   - 6-digit random codes
   - 10-minute expiry
   - Email-based verification
   - Rate limiting

4. **Input Validation**
   - express-validator middleware
   - SQL injection prevention
   - XSS protection
   - CSRF protection

5. **Authorization**
   - Role-based access control (RBAC)
   - Admin route protection
   - Resource ownership checks
   - Middleware authentication

6. **Rate Limiting**
   - API rate limits per IP
   - Login attempt throttling
   - OTP request limiting

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
# Build frontend
npm run build

# Deploy dist/ folder
```

### Backend (Railway/Render/Heroku)

1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy from GitHub/GitLab
4. Set start command: `node server.js`

### Environment Variables (Production)

- Update `FRONTEND_URL` to production URL
- Use strong `JWT_SECRET` (32+ characters)
- Configure production email service
- Set `NODE_ENV=production`
- Restrict MongoDB IP whitelist

---

## 📚 Documentation Files

This project includes comprehensive documentation:

| File | Purpose |
|------|---------|
| **README.md** | This file - Project overview, setup, usage |
| **[PROJECT_REPORT.md](./PROJECT_REPORT.md)** | Complete API reference (95+ endpoints), architecture, deployment |
| **[ADMIN_AND_FEATURES_GUIDE.md](./ADMIN_AND_FEATURES_GUIDE.md)** | Feature implementation details, certificate generation workflow |
| **[COMPLETE_IMPLEMENTATION_SUMMARY.md](./COMPLETE_IMPLEMENTATION_SUMMARY.md)** | Implementation checklist, completion status |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- React team for the amazing library
- MongoDB for the powerful database
- Express.js community
- Tailwind CSS for the utility framework
- All open-source contributors

---

## 📞 Contact & Support

- **GitHub**: [Your GitHub Profile](https://github.com/SahilGarg15)
- **Email**: gargsahil156@gmail.com

---