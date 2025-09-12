import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, FileText, BookOpen, Code, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import { ThemeProvider } from '../../Components/ThemeProvider';
import config from '../../../config/config';  // Default import
import { apiRequest, isAuthenticated } from '../../../config/config';  // Named import

// Optimized Button Component with Memoization
const Button = React.memo(({ children, onClick, variant = 'default', className = '' }) => {
  const baseStyles = "px-4 py-2 rounded-md flex items-center justify-center transition-all duration-300 w-full";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600 active:scale-95",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 active:scale-95",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label={typeof children === 'string' ? children : 'Button'}
    >
      {children}
    </button>
  );
});

// Page component with Performance Optimizations
function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEnrollCourse = useCallback(async (courseId) => {
    if (!isAuthenticated()) {
      // Redirect to auth page with return URL
      const returnUrl = `/courses`;
      navigate(`/auth?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    try {
      const data = await apiRequest(config.api.endpoints.courses.enroll(courseId), {
        method: 'POST'
      });

      setEnrolledCourses(prev => [...prev, courseId]);
      navigate('/learning-dashboard');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.message || 'Failed to enroll in course');
    }
  }, [navigate]);

  const handleOpenDashboard = useCallback(() => {
    navigate('/learning-dashboard');
  }, [navigate]);

  // Move useMemo before any conditional returns
  const courseCards = useMemo(() => 
    courses.map((course) => {
      const courseId = course?._id?.toString();
      const isEnrolled = courseId && enrolledCourses.includes(courseId);
      const title = course.title.toLowerCase();
      const isDisabled = title.includes('web development') || 
                         title.includes('data structures')
                      

      // Create icon based on course type/category
      const getIcon = () => {
        switch(course.category) {
          case 'programming':
            return <Code size={32} className="text-purple-600 dark:text-purple-400" />;
          case 'web':
            return <FileText size={32} className="text-red-600 dark:text-red-400" />;
          default:
            return <Book size={32} className="text-blue-600 dark:text-blue-400" />;
        }
      };

      // Update the path to include courseId
      const coursePath = `/course/${courseId}/modules`;
      return (
        <motion.div
          key={courseId || Math.random()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 flex flex-col"
        >
          <div className="flex items-center mb-4">
            {getIcon()}
            <h2 className="ml-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
              {course.title}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            {course.description}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="bg-purple-50 dark:bg-purple-900 px-2 py-1 rounded-full text-purple-600 dark:text-purple-300">
              {course.difficulty}
            </span>
            <span>
              <FileText size={16} className="inline-block mr-2" />
              {course.duration} hours
            </span>
          </div>
          <div className="flex gap-2 mt-4">
            {isEnrolled ? (
              <Button 
                onClick={handleOpenDashboard}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <BookOpen className="mr-2" size={16} />
                Continue Learning
              </Button>
            ) : (
              <Button 
                onClick={() => !isDisabled && courseId && handleEnrollCourse(courseId)}
                className={`${
                  isDisabled 
                    ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-white`}
              >
                {isDisabled ? 'Coming Soon' : 'Enroll Now'}
              </Button>
            )}
          </div>
        </motion.div>
      );
    }), [courses, enrolledCourses, handleEnrollCourse, handleOpenDashboard]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all courses
        const coursesData = await apiRequest(config.api.endpoints.courses.list);
        setCourses(coursesData);
        
        // Only fetch enrolled courses if user is authenticated
        if (isAuthenticated()) {
          try {
            const enrolledData = await apiRequest(config.api.endpoints.courses.enrolled);
            const enrolledCoursesData = enrolledData.courses || enrolledData;
            const enrolledIds = (enrolledCoursesData || [])
              .map(course => course._id?.toString())
              .filter(Boolean);
            
            setEnrolledCourses(enrolledIds);
          } catch (enrolledError) {
            console.error('Failed to fetch enrolled courses:', enrolledError);
            setEnrolledCourses([]);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array

  if (loading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen flex items-center justify-center text-red-500">
          {error}
        </div>
      </ThemeProvider>
    );
  }

  // Main render
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen overflow-y-auto bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Header />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-20 py-8 px-4 sm:px-6 lg:px-8"
        >
          {/* ...existing content... */}
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 mb-4">
                Explore Our Courses
              </h1>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Unlock your potential with our expertly crafted learning paths designed to take you from beginner to professional.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseCards}
            </div>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}
export default React.memo(CoursesPage);