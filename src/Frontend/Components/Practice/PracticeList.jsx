import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code2, Clock, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';
import Header from '../Header.jsx';

const PracticeList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    checkEnrollment();
  }, [courseId]);

  const checkEnrollment = async () => {
    try {
      const response = await apiRequest('/api/users/enrollments/me');
      if (response.success) {
        const isEnrolled = response.data.some(enrollment => enrollment.course._id === courseId);
        setEnrolled(isEnrolled);
        if (isEnrolled) {
          fetchPractices();
          fetchStats();
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setEnrolled(true);
      fetchPractices();
      fetchStats();
    } finally {
      setLoading(false);
    }
  };

  const fetchPractices = async () => {
    try {
      const response = await apiRequest(`/api/practice/course/${courseId}`);
      if (response.success) {
        setPractices(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching practices:', error);
      toast.error('Failed to load practice exercises');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiRequest(`/api/practice/stats/${courseId}`);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!enrolled) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-2xl mx-auto text-center py-12">
            <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Enrollment Required</h2>
            <p className="text-gray-400 mb-6">You need to enroll in this course to access practice exercises.</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              View Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/course/${courseId}/modules`)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </button>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">Practice Exercises</h1>
            <p className="text-gray-400">Sharpen your skills with hands-on coding challenges</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Code2 className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400">Total Submissions</span>
                </div>
                <p className="text-3xl font-bold text-gray-100">{stats.totalSubmissions || 0}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400">Solved</span>
                </div>
                <p className="text-3xl font-bold text-gray-100">{stats.solvedQuestions || 0}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400">Success Rate</span>
                </div>
                <p className="text-3xl font-bold text-gray-100">
                  {stats.totalSubmissions > 0 
                    ? Math.round((stats.solvedQuestions / stats.totalSubmissions) * 100) 
                    : 0}%
                </p>
              </div>
            </div>
          )}

          {/* Practice List */}
          <div className="space-y-4">
            {practices.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
                <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-100 mb-2">No Practice Exercises Yet</h3>
                <p className="text-gray-400">
                  Practice exercises will appear here as they become available for this course.
                </p>
              </div>
            ) : (
              practices.map((practice) => (
                <div
                  key={practice._id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => navigate(`/course/${courseId}/practice/${practice._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">{practice.title}</h3>
                      <p className="text-gray-400 mb-4">{practice.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Code2 className="w-4 h-4" />
                          <span>{practice.questions?.length || 0} Questions</span>
                        </div>
                        {practice.difficulty && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            practice.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            practice.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {practice.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        Start Practice
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeList;
