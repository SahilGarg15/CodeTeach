import React, { Suspense, lazy, memo, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './Frontend/Components/ThemeProvider';
import config from './config/config';  // Default import
import { isAuthenticated, apiRequest } from './config/config';  // Named imports
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
const LearnJava = lazy(() => import('./Course Modules/Java/LearnJava'));
const LearnCpp = lazy(() => import('./Course Modules/Cpp/LearnCpp'));
const LearningDashboard = lazy(() => import('./Frontend/pages/EnrolledCourse/learningdashboard'));
const Auth = lazy(() => import('./Frontend/pages/Authentication/signup&&login'));
const About = lazy(() => import('./Frontend/pages/About/About')); // Add About to lazy imports
const Contact = lazy(() => import('./Frontend/pages/Contact/Contact')); // Add Contact to lazy imports
const AdminPanel = lazy(() => import('./Frontend/pages/Admin/AdminPanel')); // Add AdminPanel to lazy imports

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};
// Public Route Component
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const user = JSON.parse(localStorage.getItem('user'));
    const redirectTo = user?.role === 'admin' ? '/admin' : '/learning-dashboard';
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

const CourseSelector = () => {
  const { courseId } = useParams();
  const [courseType, setCourseType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(config.api.endpoints.courses.list);
        // Backend returns { success: true, data: courses }
        const coursesData = response.data || response.courses || [];
        const course = coursesData.find(c => c._id === courseId);
        
        if (course) {
          const title = course.title.toLowerCase();
          if (title.includes('java')) {
            setCourseType('java');
          } else if (title.includes('c++')) {
            setCourseType('cpp');
          }
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const getCourseComponent = () => {
    switch (courseType) {
      case 'java':
        return LearnJava;
      case 'cpp':
        return LearnCpp;
      default:
        return null;
    }
  };

  const CourseComponent = getCourseComponent();
  
  if (!CourseComponent) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <Routes>
      <Route path="modules/*" element={<CourseComponent />} />
      <Route path="*" element={<Navigate to={`/course/${courseId}/modules`} replace />} />
    </Routes>
  );
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
            <Route path="/course/:courseId/*" element={
              <ProtectedRoute>
                <CourseSelector />
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
