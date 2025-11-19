import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, BookOpen, CheckCircle, ChevronRight, Clock, Award } from 'lucide-react';
import { apiRequest } from '../../config/config';
import { toast } from 'react-toastify';
import Header from './Header.jsx';

const DynamicCoursePage = () => {
  const { courseId, moduleId, topicId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, [courseId]);

  useEffect(() => {
    if (course && moduleId && topicId) {
      const module = course.modules.find(m => m.moduleId === moduleId);
      if (module) {
        setCurrentModule(module);
        const topic = module.topics.find(t => t.topicId === topicId);
        setCurrentTopic(topic);
      }
    }
  }, [course, moduleId, topicId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/courses/${courseId}`);
      if (response.success) {
        setCourse(response.data);
        
        // If no moduleId/topicId in URL, redirect to first module/topic
        if (!moduleId || !topicId) {
          const firstModule = response.data.modules[0];
          const firstTopic = firstModule?.topics[0];
          if (firstModule && firstTopic) {
            navigate(`/course/${courseId}/modules/${firstModule.moduleId}/${firstTopic.topicId}`, { replace: true });
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await apiRequest(`/api/progress/course/${courseId}`);
      if (response.success && response.data.topics) {
        const completed = new Set(
          response.data.topics
            .filter(p => p.status === 'completed')
            .map(p => p.topicId)
        );
        setCompletedTopics(completed);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      // Don't show error to user, just continue without progress data
    }
  };

  const handleTopicClick = (module, topic) => {
    navigate(`/course/${courseId}/modules/${module.moduleId}/${topic.topicId}`);
  };

  const handleTopicComplete = async () => {
    if (!currentModule || !currentTopic) return;
    
    try {
      const response = await apiRequest(`/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId,
          moduleId: currentModule.moduleId,
          topicId: currentTopic.topicId,
          status: 'completed'
        })
      });
      
      if (response.success) {
        setCompletedTopics(prev => new Set([...prev, currentTopic.topicId]));
        toast.success('Topic marked as complete!');
      }
    } catch (error) {
      console.error('Failed to mark topic complete:', error);
      toast.error(error.message || 'Failed to mark topic as complete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-4">The requested course could not be found.</p>
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
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar - Module/Topic List */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto fixed left-0 top-16 h-[calc(100vh-64px)]">
          <div className="p-4 border-b border-gray-700 bg-gray-800/95 backdrop-blur sticky top-0 z-10">
            <h2 className="text-xl font-bold text-gray-100">{course.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{course.modules?.length || 0} modules</p>
          </div>
          
          <div className="p-4 space-y-4">
            {course.modules?.map((module) => (
              <div key={module.moduleId} className="space-y-2">
                <div className="flex items-center gap-2 text-gray-100 font-semibold">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span>{module.title}</span>
                </div>
                <div className="ml-7 space-y-1">
                  {module.topics?.map((topic) => {
                    const isActive = currentTopic?.topicId === topic.topicId;
                    const isCompleted = completedTopics.has(topic.topicId);
                    
                    return (
                      <button
                        key={topic.topicId}
                        onClick={() => handleTopicClick(module, topic)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-sm flex-1">{topic.title}</span>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                        {isActive && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-80 pb-8">
          {currentTopic ? (
            <div className="max-w-5xl mx-auto p-8">
              {/* Breadcrumb */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <span>{currentModule?.title}</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-300">{currentTopic.title}</span>
                </div>
                
                {/* Topic Header */}
                <h1 className="text-4xl font-bold text-gray-100 mb-3">
                  {currentTopic.title}
                </h1>
                {currentTopic.description && (
                  <p className="text-xl text-gray-400 mb-4">{currentTopic.description}</p>
                )}
                
                {/* Topic Meta Info */}
                <div className="flex items-center gap-4 text-sm">
                  {currentTopic.estimatedTime && (
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{currentTopic.estimatedTime}</span>
                    </div>
                  )}
                  {currentTopic.hasPractice && (
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <Award className="w-4 h-4" />
                      <span>Practice Available</span>
                    </div>
                  )}
                  {completedTopics.has(currentTopic.topicId) && (
                    <div className="flex items-center gap-1.5 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 mb-6">
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="text-gray-300 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Welcome to <strong>{currentTopic.title}</strong>! This lesson will help you understand the fundamentals.
                    </p>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
                      <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Learning Objectives
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>Understand the core concepts</li>
                        <li>Learn through practical examples</li>
                        <li>Apply knowledge in real scenarios</li>
                      </ul>
                    </div>

                    <p className="text-gray-400 italic text-sm mt-8 p-4 bg-gray-700/30 rounded-lg">
                      💡 <strong>Note:</strong> Detailed lesson content will be added here. This is a placeholder showing the dynamic course structure is working correctly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <button
                  onClick={handleTopicComplete}
                  disabled={completedTopics.has(currentTopic.topicId)}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    completedTopics.has(currentTopic.topicId)
                      ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  {completedTopics.has(currentTopic.topicId) ? 'Completed' : 'Mark as Complete'}
                </button>

                {currentTopic.hasPractice && (
                  <button 
                    onClick={() => navigate(`/course/${courseId}/practice`)}
                    className="px-6 py-3 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all"
                  >
                    Start Practice
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-2">Select a Topic</h3>
                <p className="text-gray-400">Choose a topic from the sidebar to begin learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicCoursePage;
