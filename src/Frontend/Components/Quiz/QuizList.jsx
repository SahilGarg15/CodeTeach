import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Trophy, CheckCircle, XCircle, PlayCircle, Loader2, Award, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const QuizList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchQuizzes();
    checkEnrollment();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/quizzes/course/${courseId}`);
      if (response.success) {
        setQuizzes(response.data);
      }
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await apiRequest(`/api/users/enrollments/me`);
      if (response.success) {
        const isEnrolledInCourse = response.data.some(enrollment => 
          enrollment.course._id === courseId || enrollment.course === courseId
        );
        setEnrolled(isEnrolledInCourse);
      } else {
        setEnrolled(false);
      }
    } catch (error) {
      console.error('Failed to check enrollment:', error);
      // If there's an error checking, assume they might be enrolled to avoid blocking
      setEnrolled(true);
    }
  };

  const getStatusBadge = (quiz) => {
    if (!quiz.bestScore && quiz.attempts === 0) {
      return <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">Not Attempted</span>;
    }
    if (quiz.bestScore >= quiz.passingScore) {
      return <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Passed
      </span>;
    }
    return <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full flex items-center gap-1">
      <XCircle className="w-3 h-3" />
      Failed
    </span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Course Quizzes</h1>
          <p className="text-gray-400">Test your knowledge and track your progress</p>
        </div>

        {!enrolled && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-400">You need to enroll in this course to take quizzes.</p>
            </div>
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Quizzes Yet</h3>
            <p className="text-gray-500">Check back later for quizzes in this course.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-100">{quiz.title}</h3>
                      {getStatusBadge(quiz)}
                    </div>
                    {quiz.description && (
                      <p className="text-gray-400 mb-4">{quiz.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-semibold text-gray-200">{quiz.duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-500">Total Points</p>
                      <p className="text-sm font-semibold text-gray-200">{quiz.totalPoints}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-500">Passing Score</p>
                      <p className="text-sm font-semibold text-gray-200">{quiz.passingScore}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-gray-500">Questions</p>
                      <p className="text-sm font-semibold text-gray-200">{quiz.questions.length}</p>
                    </div>
                  </div>
                </div>

                {quiz.attempts > 0 && (
                  <div className="bg-gray-900/50 rounded-lg p-4 mb-4 border border-gray-700/50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Attempts</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {quiz.attempts} / {quiz.maxAttempts === 0 ? '∞' : quiz.maxAttempts}
                        </p>
                      </div>
                      {quiz.bestScore !== null && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Best Score</p>
                          <p className={`text-lg font-semibold ${
                            quiz.bestScore >= quiz.passingScore ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {quiz.bestScore.toFixed(1)}%
                          </p>
                        </div>
                      )}
                      {quiz.lastAttempt && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Last Attempt</p>
                          <p className="text-lg font-semibold text-gray-200">
                            {new Date(quiz.lastAttempt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {quiz.canAttempt ? (
                      <span className="text-green-400">✓ Available</span>
                    ) : (
                      <span className="text-red-400">✗ No attempts remaining</span>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/course/${courseId}/quiz/${quiz._id}`)}
                    disabled={!enrolled || !quiz.canAttempt}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                  >
                    <PlayCircle className="w-5 h-5" />
                    {quiz.attempts === 0 ? 'Start Quiz' : 'Retake Quiz'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
