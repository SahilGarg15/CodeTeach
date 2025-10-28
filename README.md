# 🎓 CodeTeach - Interactive Programming Learning Platform

<div align="center">

![CodeTeach Logo](https://img.shields.io/badge/CodeTeach-Learning%20Platform-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, full-stack e-learning platform for programming courses with interactive content, video lessons, code editors, and comprehensive admin management.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Admin Panel](#-admin-panel)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CodeTeach** is a comprehensive learning management system (LMS) designed specifically for programming education. It provides an intuitive interface for students to learn coding through interactive tutorials, video lessons, practice problems, and real-time code execution.

### Why CodeTeach?

- 🎯 **Interactive Learning** - Hands-on coding experience with built-in code editors
- 📚 **Structured Curriculum** - Well-organized courses with modules and topics
- 🎥 **Multimedia Content** - Video tutorials, text lessons, and interactive quizzes
- 🔐 **Secure Authentication** - OTP-based signup/login with JWT tokens
- 👨‍💼 **Admin Dashboard** - Complete management system for courses, users, and content
- 🌙 **Dark Mode** - Eye-friendly dark theme support
- 📱 **Responsive Design** - Works seamlessly on all devices

---

## ✨ Features

### 🎓 Student Features

- **User Authentication**
  - Email-based registration with OTP verification
  - Secure login with JWT tokens
  - Password encryption using bcrypt
  - Session management

- **Course Management**
  - Browse available courses (Java, C++, DSA, Web Development)
  - Enroll in multiple courses
  - Track learning progress
  - Resume where you left off

- **Interactive Learning**
  - Rich text content with syntax highlighting
  - Embedded video tutorials
  - Live code editor with syntax highlighting (Monaco Editor)
  - Practice problems and quizzes
  - Mixed content modules

- **User Dashboard**
  - View enrolled courses
  - Track progress
  - Access course materials
  - Personal profile management

### 👨‍💼 Admin Features

- **Comprehensive Admin Panel**
  - Dashboard with statistics (users, courses, enrollments)
  - User management (view, delete users)
  - Course management (CRUD operations)
  - Module management (create, edit, delete modules)
  - Advanced settings panel with 50+ configuration options

- **Settings Management** (6 Categories)
  - **General**: Site configuration, contact info, registration settings
  - **Email**: SMTP configuration, email providers, notifications
  - **Security**: 2FA, login attempts, IP whitelist, lockout policies
  - **Courses**: Visibility, ratings, comments, approval workflows
  - **System**: Maintenance mode, backups, notifications, debug settings
  - **Advanced**: Performance (cache, CDN), analytics, payments, localization

- **Content Management**
  - Dynamic module creation with multiple content types
  - Video URL embedding
  - Code snippet management
  - Quiz creation and management
  - Content moderation

---

## 🛠️ Tech Stack

### Frontend
- **React 18.x** - UI library
- **React Router v6** - Client-side routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Monaco Editor** - Code editor component
- **React Syntax Highlighter** - Code syntax highlighting

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.19.2** - Web framework
- **MongoDB Atlas** - NoSQL database
- **Mongoose 8.4.0** - MongoDB ODM

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **Nodemailer 6.9.13** - Email sending (OTP)
- **express-validator 7.0.1** - Input validation
- **cookie-parser 1.4.6** - Cookie handling
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Vite** - Build tool
- **Nodemon** - Auto-restart server
- **dotenv** - Environment variables
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📁 Project Structure

```
Code-Teach-React/
├── backend/                      # Backend server
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── email.js             # Email configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── courseController.js  # Course operations
│   │   ├── enrollmentController.js
│   │   └── adminController.js   # Admin operations
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── admin.js             # Admin authorization
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Course.js            # Course schema
│   │   └── Enrollment.js        # Enrollment schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── sendOTP.js           # OTP generation
│   │   └── validators.js        # Input validators
│   ├── .env                      # Environment variables
│   ├── server.js                # Entry point
│   └── package.json
│
├── src/                          # Frontend source
│   ├── Course Modules/           # Course content
│   │   ├── Java/
│   │   │   ├── LearnJava.jsx
│   │   │   ├── 0.Introduction To Java/
│   │   │   ├── 1.HowAprogramWorks/
│   │   │   ├── 2.Syntax And Variables/
│   │   │   ├── 3.Operators/
│   │   │   ├── 4.ControlFlow-IfElse/
│   │   │   ├── 5.ControlFlow-Switch/
│   │   │   ├── 6.Loops-For/
│   │   │   └── 7.Loops-While/
│   │   ├── Cpp/
│   │   ├── DSA/
│   │   └── WebDev/
│   │
│   ├── Frontend/
│   │   ├── Components/
│   │   │   ├── Header.jsx        # Navigation bar
│   │   │   ├── Footer.jsx
│   │   │   ├── ThemeProvider.jsx # Dark mode
│   │   │   ├── AdminRoute.jsx    # Protected routes
│   │   │   ├── Code Components/  # Code editor components
│   │   │   ├── Interface Components/
│   │   │   ├── Module Component/ # Course modules
│   │   │   └── practice components/
│   │   │
│   │   └── pages/
│   │       ├── home/             # Landing page
│   │       ├── About/
│   │       ├── Contact/
│   │       ├── Courses/          # Course listing
│   │       ├── EnrolledCourse/   # Course player
│   │       ├── Authentication/   # Login/Signup
│   │       └── Admin/
│   │           ├── AdminPanel.jsx
│   │           └── Components/
│   │               ├── Users.jsx
│   │               ├── Courses.jsx
│   │               └── ModuleForm.jsx
│   │
│   ├── config/
│   │   ├── config.js             # API endpoints
│   │   └── courseIds.js          # Course identifiers
│   │
│   ├── App.js                    # Main app component
│   ├── index.js                  # Entry point
│   └── index.css                 # Global styles
│
├── public/
│   ├── index.html
│   └── manifest.json
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **SMTP Email Service** (Gmail, SendGrid, etc.)

### Step 1: Clone the Repository

```bash
git clone https://github.com/SahilGarg15/CodeTeach.git
cd CodeTeach
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# See Configuration section below
```

### Step 3: Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install
```

### Step 4: Configure Environment Variables

Edit `backend/.env`:

```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=codeteach

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters

# Email Configuration (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

The application will open at `http://localhost:3000`

---

## ⚙️ Configuration

### MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Replace `<password>` in connection string with your database user password

### Email Configuration (Gmail)

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Use this App Password in `EMAIL_PASS` environment variable

### Admin Account Setup

To create an admin account, you can:

**Option 1: Direct Database Update**
```javascript
// In MongoDB Atlas or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true, role: "admin" } }
)
```

**Option 2: Modify User Model**
Update the user creation to include admin flag during signup.

---

## 📖 Usage

### For Students

1. **Sign Up**
   - Navigate to `/auth`
   - Enter email and password
   - Verify email with OTP sent to your inbox
   - Complete registration

2. **Browse Courses**
   - Visit `/courses`
   - View available courses
   - Click "Learn More" for course details

3. **Enroll in a Course**
   - Click "Enroll Now" on course page
   - Access course content immediately

4. **Learn**
   - Navigate through modules and topics
   - Watch video tutorials
   - Practice with code editors
   - Complete quizzes and exercises

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to `/admin`

2. **Manage Users**
   - View all registered users
   - View user details
   - Delete users if necessary

3. **Manage Courses**
   - Create new courses
   - Edit existing courses
   - Delete courses
   - Manage course modules

4. **Configure Settings**
   - Customize site settings
   - Configure email system
   - Set security policies
   - Manage course policies
   - Configure notifications

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Resend OTP
```http
POST /auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Course Endpoints

#### Get All Courses
```http
GET /courses
Authorization: Bearer <token>
```

#### Get Single Course
```http
GET /courses/:id
Authorization: Bearer <token>
```

#### Enroll in Course
```http
POST /enrollments/enroll
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id_here"
}
```

#### Get User Enrollments
```http
GET /enrollments/my-enrollments
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

#### Delete User
```http
DELETE /admin/users/:userId
Authorization: Bearer <admin_token>
```

#### Create Course
```http
POST /admin/courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Course Title",
  "description": "Course Description",
  "category": "Programming",
  "duration": "10 hours",
  "price": 0,
  "image": "image_url"
}
```

#### Update Course
```http
PUT /admin/courses/:courseId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "modules": [...]
}
```

#### Delete Course
```http
DELETE /admin/courses/:courseId
Authorization: Bearer <admin_token>
```

---

## 🎛️ Admin Panel

### Dashboard
- **Total Users**: View registered user count
- **Total Courses**: See all available courses
- **Total Enrollments**: Track course enrollments
- **Recent Users**: Quick view of latest registrations
- **Popular Courses**: See trending courses

### User Management
- View all users with details (name, email, role)
- Delete users with confirmation
- Search and filter users

### Course Management
- Create new courses with details
- Edit existing course information
- Delete courses
- Manage course modules dynamically

### Module Management
- Create modules with multiple content types:
  - **Text Content**: Rich text lessons
  - **Video Content**: Embedded video URLs
  - **Code Content**: Interactive code editors
  - **Quiz Content**: Multiple choice questions
  - **Mixed Content**: Combination of all types
- Drag-and-drop topic organization
- Collapsible module sections

### Settings Panel
Comprehensive configuration with 6 categories and 50+ settings:

1. **General Settings**
   - Site name, URL, description
   - Contact emails
   - Registration settings
   - Session timeout

2. **Email Configuration**
   - Email provider selection
   - SMTP settings
   - Email templates

3. **Security Settings**
   - Two-factor authentication
   - Login attempt limits
   - IP whitelisting
   - Lockout policies

4. **Course Settings**
   - Default visibility
   - User course creation
   - Ratings and comments
   - Content moderation

5. **System Settings**
   - Maintenance mode
   - Debug mode
   - Backup frequency
   - Notifications

6. **Advanced Settings**
   - Performance optimization
   - Analytics integration
   - Multi-language support
   - Payment configuration

---

## 🎨 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400?text=Home+Page)

### Course Listing
![Courses](https://via.placeholder.com/800x400?text=Course+Listing)

### Course Player
![Course Player](https://via.placeholder.com/800x400?text=Course+Player)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

### Settings Panel
![Settings](https://via.placeholder.com/800x400?text=Settings+Panel)

---

## 🔐 Security Features

- **Password Encryption**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based auth
- **OTP Verification**: Email-based verification
- **Protected Routes**: Middleware for auth and admin checks
- **Input Validation**: Express-validator for all inputs
- **CORS Configuration**: Restricted cross-origin requests
- **Environment Variables**: Sensitive data protection
- **Session Management**: Token expiration and refresh
- **Admin Authorization**: Role-based access control

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Known Issues

- [ ] Module drag-and-drop reordering needs implementation
- [ ] Payment gateway integration pending
- [ ] Multi-language support needs translation files
- [ ] Mobile responsive improvements for admin panel
- [ ] Email template customization in progress

---

## 📝 Future Enhancements

- [ ] Real-time chat support
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered course recommendations
- [ ] Live coding sessions
- [ ] Peer code review system
- [ ] Gamification (badges, leaderboards)
- [ ] Course marketplace

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sahil Garg**
- GitHub: [@SahilGarg15](https://github.com/SahilGarg15)
- Repository: [CodeTeach](https://github.com/SahilGarg15/CodeTeach)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the excellent database
- All contributors and supporters
- Open-source community

---

## 📞 Support

For support, email support@codeteach.com or open an issue on GitHub.

---

<div align="center">

**Made with ❤️ for developers by developers**

⭐ Star this repo if you find it helpful!

</div>
