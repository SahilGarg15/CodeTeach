import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, XCircle, Code, Book, FileText } from 'lucide-react';
import Header from '../../Components/Header';
import { ThemeProvider } from '../../Components/ThemeProvider';
import config from '../../../config/config';  // Default import
import { apiRequest } from '../../../config/config';  // Named import
import { useNavigate } from 'react-router-dom';

const getModulesForCourse = (courseTitle) => {
  // Map course titles to their respective module files
  const moduleMap = {
    'Java': require('../../Components/Module Component/Java Modules').modules,
    'C++': require('../../Components/Module Component/Cpp Modules').modules,
    'DSA': require('../../Components/Module Component/DSA Modules').modules,
    "web development": require('../../Components/Module Component/WebDev Modules').modules,
    // Add other courses here as they are created
    // 'Python': require('../../Components/Module Component/Python Modules').modules,
    // 'JavaScript': require('../../Components/Module Component/JavaScript Modules').modules,
  };

  // Get the course key (e.g., "Java" from "Java Programming")
  const courseKey = Object.keys(moduleMap).find(key => 
    courseTitle.toLowerCase().includes(key.toLowerCase())
  );

  return courseKey ? moduleMap[courseKey] : null;
};

function LearningDashboard() {
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState(null);

  // Fetch enrolled courses from backend
  useEffect(() => {
    const fetchEnrolledCourses = async (retryCount = 0) => {
      try {
        setIsLoading(true);
        const data = await apiRequest(config.api.endpoints.courses.enrolled);
        
        // Handle the new response format
        const courses = Array.isArray(data) ? data : (data.courses || []);
        
        // Add module and test set counts for each course
        const coursesWithCounts = courses.map(course => {
          let totalModules = 0;
          let testSets = 0;

          try {
            const courseModules = getModulesForCourse(course.title);
            
            if (courseModules) {
              // Count total modules
              totalModules = courseModules.reduce((sum, module) => 
                sum + module.subModules.length, 0
              );
              
              // Count test sets
              testSets = courseModules.reduce((sum, module) => {
                return sum + module.subModules.filter(sub => 
                  sub.title.toLowerCase().includes('practice set') || 
                  sub.title.toLowerCase().includes('test')
                ).length;
              }, 0);
            }
          } catch (err) {
            console.warn(`Could not load modules for course: ${course.title}`, err);
          }
          
          return {
            ...course,
            totalModules,
            testSets
          };
        });
        
        setEnrolledCourses(coursesWithCounts);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        if (retryCount < 3) {
          console.log(`Attempt ${retryCount + 1}: Retrying in 2 seconds...`);
          setTimeout(() => fetchEnrolledCourses(retryCount + 1), 2000);
        } else {
          setError(err.message || 'Failed to fetch enrolled courses');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId) => {
    setShowConfirmation(courseId);
  };

  const confirmUnenroll = async (courseId) => {
    try {
      await apiRequest(config.api.endpoints.courses.enroll(courseId), {
        method: 'DELETE'
      });
      
      setEnrolledCourses(prev => prev.filter(course => course._id !== courseId));
      setShowConfirmation(null);
    } catch (err) {
      console.error('Error unenrolling:', err);
      alert(err.message || 'Failed to unenroll from course');
    }
  };

  // Get icon based on course category
  const getIcon = (category) => {
    switch(category) {
      case 'programming':
        return <Code size={32} className="text-purple-600 dark:text-purple-400" />;
      case 'web':
        return <FileText size={32} className="text-red-600 dark:text-red-400" />;
      default:
        return <Book size={32} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Add this helper function inside the component
  const formatLastAccessed = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const navigate = useNavigate();

  const handleContinueLearning = async (course) => {
    if (!course?._id) {
      console.error('Invalid course object:', course);
      return;
    }
  
    // Get course modules - Move this outside try block so it's available in catch
    const courseModules = getModulesForCourse(course.title);
    if (!courseModules) {
      console.error('No modules found for course:', course.title);
      return;
    }

    try {
      // Update last accessed time
      await apiRequest(config.api.endpoints.courses.lastAccessed(course._id), {
        method: 'PUT'
      });

      // Fetch current progress from backend
      const progressResponse = await apiRequest(config.api.endpoints.courses.progress(course._id), {
        method: 'GET'
      });
  
      // Log the response for debugging
      console.log('Progress response:', progressResponse);
  
      if (progressResponse?.completedModules?.length > 0) {
        // Find the last completed module
        const lastCompletedId = progressResponse.completedModules[progressResponse.completedModules.length - 1];
        const [lastModuleId, lastSubModuleId] = lastCompletedId.split('.');
  
        // Find the next module after the last completed one
        let found = false;
        let nextModule = null;
        let nextSubModule = null;
  
        // Search through modules to find the next uncompleted one
        for (const module of courseModules) {
          for (const subModule of module.subModules) {
            if (found && !progressResponse.completedModules.includes(`${module.id}.${subModule.id}`)) {
              nextModule = module;
              nextSubModule = subModule;
              break;
            }
            if (module.id === lastModuleId && subModule.id === lastSubModuleId) {
              found = true;
            }
          }
          if (nextModule) break;
        }
  
        if (nextModule && nextSubModule) {
          // Navigate to next uncompleted module
          navigate(`/course/${course._id}/modules/${nextModule.id}/${nextSubModule.id}`);
          return;
        }
      }
  
      // If no completed modules or next module not found, check for last accessed
      if (progressResponse?.lastVisited) {
        const { moduleId, subModuleId } = progressResponse.lastVisited;
        navigate(`/course/${course._id}/modules/${moduleId}/${subModuleId}`);
        return;
      }
  
      // If no progress at all, start from first module
      const firstModule = courseModules[0];
      const firstSubModule = firstModule.subModules[0];
      navigate(`/course/${course._id}/modules/${firstModule.id}/${firstSubModule.id}`);
  
    } catch (error) {
      console.error('Error handling course navigation:', error);
      // Now courseModules is available in catch block
      try {
        // Navigate to first module as fallback
        const firstModule = courseModules[0];
        const firstSubModule = firstModule.subModules[0];
        navigate(`/course/${course._id}/modules/${firstModule.id}/${firstSubModule.id}`);
      } catch (fallbackError) {
        console.error('Failed to navigate to first module:', fallbackError);
        // Final fallback - just go to modules page
        navigate(`/course/${course._id}/modules`);
      }
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </ThemeProvider>
    );
  }
  // Optional: Add error handling in UI if you want to keep the error state
  if (error) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen overflow-y-auto bg-gradient-to-br from-purple-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
        <Header/>
        {/* Confirmation Modal */}
        {showConfirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Confirm Unenrollment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Warning: Unenrolling from this course will remove all your progress and saved data. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmUnenroll(showConfirmation)}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  Unenroll
                </button>
              </div>
            </div>
          </motion.div>
        )}
        <div className="container mx-auto px-4 py-8 pt-20">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
          >
            My Learning Dashboard
          </motion.h1>
          
          <motion.div
            initial={false}
            animate={isLoading ? "hidden" : "show"}
            variants={containerVariants}
          >
            {enrolledCourses.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-600 dark:text-gray-400 text-xl">
                  You haven't enrolled in any courses yet.
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/courses'}
                  className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Browse Courses
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <motion.div
                    key={course._id}
                    variants={itemVariants}
                    layout
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getIcon(course.category)}
                        <h2 className="ml-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {course.title}
                        </h2>
                      </div>
                      <button
                        onClick={() => handleUnenroll(course._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Unenroll"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {course.description}
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-purple-500">
                          <Award size={16} className="mr-2" />
                          <span>{course.difficulty}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock size={16} className="mr-2" />
                          <span>{course.duration} hours</span>
                        </div>
                      </div>

                      {/* Add module and test set counts */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Total Modules: {course.totalModules || 0}</span>
                        <span>Test Sets: {course.testSets || 0}</span>
                      </div>



                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
                        onClick={() => handleContinueLearning(course)}
                      >
                        <BookOpen size={16} className="mr-2" />
                        Continue Learning
                      </motion.button>
                    </div>
                  </motion.div>
                  
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}
export default React.memo(LearningDashboard);
