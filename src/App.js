import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './Frontend/Components/ThemeProvider';
import AdminRoute from './Frontend/Components/AdminRoute';

// Custom loading component
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 dark:border-purple-400"/>
  </div>
));

// Lazy load components
const Home = lazy(() => import('./Frontend/pages/home/homepage'));
const Courses = lazy(() => import('./Frontend/pages/Courses/Courses'));
const LearningDashboard = lazy(() => import('./Frontend/pages/EnrolledCourse/learningdashboard'));
const Auth = lazy(() => import('./Frontend/pages/Authentication/signup&&login'));
const About = lazy(() => import('./Frontend/pages/About/About'));
const Contact = lazy(() => import('./Frontend/pages/Contact/Contact'));
const AdminPanel = lazy(() => import('./Frontend/pages/Admin/AdminPanel'));
const DynamicCoursePage = lazy(() => import('./Frontend/Components/DynamicCoursePage'));

// New feature components
const DynamicCoursePlayer = lazy(() => import('./Frontend/Components/DynamicCoursePlayer'));
const DiscussionForum = lazy(() => import('./Frontend/Components/Discussion/DiscussionForum'));
const DiscussionThread = lazy(() => import('./Frontend/Components/Discussion/DiscussionThread'));
const QuizList = lazy(() => import('./Frontend/Components/Quiz/QuizList'));
const QuizInterface = lazy(() => import('./Frontend/Components/Quiz/QuizInterface'));
const AssignmentList = lazy(() => import('./Frontend/Components/Assignment/AssignmentList'));
const AssignmentInterface = lazy(() => import('./Frontend/Components/Assignment/AssignmentInterface'));
const PracticeList = lazy(() => import('./Frontend/Components/Practice/PracticeList'));
const MyCertificates = lazy(() => import('./Frontend/Components/Certificate/MyCertificates'));
const CertificateDisplay = lazy(() => import('./Frontend/Components/Certificate/CertificateDisplay'));
const CourseReviews = lazy(() => import('./Frontend/Components/Reviews/CourseReviews'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('token');
      return Boolean(token);
    } catch (error) {
      return false;
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('token');
      return Boolean(token);
    } catch (error) {
      return false;
    }
  };

  if (isAuthenticated()) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const redirectTo = user?.role === 'admin' ? '/admin' : '/learning-dashboard';
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } />

            {/* Admin Routes - Admin Dashboard for management */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />

            {/* Public Routes - Accessible to all authenticated users */}
            <Route path="/" element={<Home />} />
            <Route path="/homepage" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Learning Dashboard - For all users (including admins) to take courses */}
            <Route path="/learning-dashboard" element={
              <ProtectedRoute>
                <LearningDashboard />
              </ProtectedRoute>
            } />
            
            {/* Course Content - Accessible to all enrolled users */}
            <Route path="/course/:courseId/modules/:moduleId/:topicId" element={
              <ProtectedRoute>
                <DynamicCoursePage />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId/modules" element={
              <ProtectedRoute>
                <DynamicCoursePage />
              </ProtectedRoute>
            } />
            
            {/* Discussion Forum Routes */}
            <Route path="/course/:courseId/discussions" element={
              <ProtectedRoute>
                <DiscussionForum />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId/discussion/:discussionId" element={
              <ProtectedRoute>
                <DiscussionThread />
              </ProtectedRoute>
            } />

            {/* Quiz Routes */}
            <Route path="/course/:courseId/quizzes" element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId/quiz/:quizId" element={
              <ProtectedRoute>
                <QuizInterface />
              </ProtectedRoute>
            } />

            {/* Assignment Routes */}
            <Route path="/course/:courseId/assignments" element={
              <ProtectedRoute>
                <AssignmentList />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId/assignment/:assignmentId" element={
              <ProtectedRoute>
                <AssignmentInterface />
              </ProtectedRoute>
            } />

            {/* Practice Routes */}
            <Route path="/course/:courseId/practice" element={
              <ProtectedRoute>
                <PracticeList />
              </ProtectedRoute>
            } />

            {/* Course Reviews */}
            <Route path="/course/:courseId/reviews" element={
              <ProtectedRoute>
                <CourseReviews />
              </ProtectedRoute>
            } />
            
            {/* Redirect /course/:courseId to modules */}
            <Route 
              path="/course/:courseId" 
              element={<Navigate to="modules" replace />} 
            />

            {/* Dynamic Course Player - Use for all courses */}
            <Route path="/learn/:courseId" element={
              <ProtectedRoute>
                <DynamicCoursePlayer />
              </ProtectedRoute>
            } />

            {/* Certificate Routes - Global (not course-specific) */}
            <Route path="/my-certificates" element={
              <ProtectedRoute>
                <MyCertificates />
              </ProtectedRoute>
            } />
            <Route path="/certificate/:certificateId" element={
              <ProtectedRoute>
                <CertificateDisplay />
              </ProtectedRoute>
            } />

            {/* Default Redirect - Admin to admin panel, others to home */}
            <Route path="*" element={
              <Navigate to={isAdmin ? "/admin" : "/"} replace />
            } />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
