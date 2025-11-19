import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import CourseLayout from './Interface Components/interface';
import { apiRequest } from '../../config/config';

/**
 * Dynamic Course Player Component
 * 
 * Replaces hardcoded course components (LearnJava, LearnCpp, etc.)
 * Fetches course content dynamically from backend API
 */
const DynamicCoursePlayer = () => {
  const { courseId, moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);

  // Fetch course data from backend
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseResponse = await apiRequest(`/api/courses/${courseId}`);
        
        if (!courseResponse.success) {
          throw new Error(courseResponse.message || 'Failed to load course');
        }

        const course = courseResponse.data;
        setCourseData(course);

        // Check if user is enrolled
        if (!course.isEnrolled) {
          // Redirect to course details page if not enrolled
          navigate(`/course/${courseId}`, { replace: true });
          return;
        }

        // Transform backend modules to frontend format
        const transformedModules = course.modules.map((module, moduleIndex) => ({
          id: module.moduleId,
          title: module.title,
          description: module.description,
          order: module.order,
          subModules: module.topics.map((topic, topicIndex) => ({
            id: topic.topicId,
            title: topic.title,
            description: topic.description,
            order: topic.order,
            estimatedTime: topic.estimatedTime,
            hasPractice: topic.hasPractice,
            componentPath: topic.componentPath, // Path to React component if using hardcoded components
            // Dynamic content will be fetched separately when needed
          }))
        }));

        setModules(transformedModules);

        // Get enrollment data for progress tracking
        try {
          const enrollmentResponse = await apiRequest(`/api/enrollments/course/${courseId}/my-enrollment`);
          if (enrollmentResponse.success) {
            setEnrollment(enrollmentResponse.data);
          }
        } catch (err) {
          console.error('Failed to fetch enrollment:', err);
        }

        // If on base course path, redirect to first module
        if (location.pathname === `/course/${courseId}/learn` || 
            location.pathname === `/course/${courseId}/modules`) {
          if (transformedModules.length > 0 && transformedModules[0].subModules.length > 0) {
            const firstModule = transformedModules[0];
            const firstTopic = firstModule.subModules[0];
            navigate(`/course/${courseId}/modules/${firstModule.id}/${firstTopic.id}`, { replace: true });
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading course:', err);
        setError(err.message || 'Failed to load course content');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, navigate, location.pathname]);

  // Handle topic completion
  const handleTopicComplete = useCallback(async (moduleId, topicId) => {
    try {
      await apiRequest('/api/progress/update', {
        method: 'POST',
        body: JSON.stringify({
          courseId,
          moduleId,
          topicId,
          completed: true
        })
      });

      // Refresh enrollment data to update progress
      const enrollmentResponse = await apiRequest(`/api/enrollments/course/${courseId}/my-enrollment`);
      if (enrollmentResponse.success) {
        setEnrollment(enrollmentResponse.data);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4 p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-100">Failed to Load Course</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!courseData || modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4 p-6">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-100">No Content Available</h2>
          <p className="text-gray-400">This course doesn't have any modules yet.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseLayout
      courseName={courseData.title}
      courseShortName={courseData.title.split(' ')[0]}
      modules={modules}
      basePath={`/course/${courseId}/modules`}
      courseId={courseId}
      enrollment={enrollment}
      onTopicComplete={handleTopicComplete}
    />
  );
};

export default DynamicCoursePlayer;
