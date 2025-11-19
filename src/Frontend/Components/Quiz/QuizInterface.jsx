import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Trophy, PlayCircle, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const QuizInterface = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (attempt && quiz && !showResults) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
        const remaining = (quiz.duration * 60) - elapsed;
        
        if (remaining <= 0) {
          handleSubmitQuiz();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [attempt, quiz, showResults]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/quizzes/${quizId}`);
      if (response.success) {
        setQuiz(response.data);
        setTimeLeft(response.data.duration * 60);
      }
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate(`/course/${courseId}/quizzes`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      const response = await apiRequest(`/api/quizzes/${quizId}/start`, {
        method: 'POST'
      });
      
      if (response.success) {
        setAttempt(response.data);
        toast.success('Quiz started! Good luck!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to start quiz');
    }
  };

  const handleAnswerSelect = async (questionId, answer) => {
    if (!attempt || showResults) return;

    setAnswers({ ...answers, [questionId]: answer });

    try {
      await apiRequest(`/api/quizzes/attempts/${attempt._id}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          questionId,
          selectedOption: answer.optionId,
          answer: answer.value,
          timeTaken: 0
        })
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!attempt) return;

    const unanswered = quiz.questions.filter(q => !answers[q._id]);
    if (unanswered.length > 0 && !window.confirm(`You have ${unanswered.length} unanswered questions. Submit anyway?`)) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiRequest(`/api/quizzes/attempts/${attempt._id}/complete`, {
        method: 'POST'
      });

      if (response.success) {
        setResults(response.data);
        setShowResults(true);
        toast.success('Quiz submitted successfully!');
      }
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!quiz) return null;

  // Quiz Start Screen
  if (!attempt && !showResults) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50">
            <h1 className="text-3xl font-bold text-gray-100 mb-4">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-gray-300 mb-6">{quiz.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">Duration</span>
                </div>
                <p className="text-xl font-semibold text-gray-100">{quiz.duration} minutes</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Total Points</span>
                </div>
                <p className="text-xl font-semibold text-gray-100">{quiz.totalPoints}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Passing Score</span>
                </div>
                <p className="text-xl font-semibold text-gray-100">{quiz.passingScore}%</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-400">Questions</span>
                </div>
                <p className="text-xl font-semibold text-gray-100">{quiz.questions.length}</p>
              </div>
            </div>

            {quiz.instructions && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-400 mb-2">Instructions:</h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{quiz.instructions}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {quiz.canAttempt ? (
                  <p>Attempts: {quiz.attempts} / {quiz.maxAttempts === 0 ? '∞' : quiz.maxAttempts}</p>
                ) : (
                  <p className="text-red-400">No attempts remaining</p>
                )}
                {quiz.bestScore !== null && (
                  <p>Best Score: {quiz.bestScore.toFixed(1)}%</p>
                )}
              </div>
              <button
                onClick={handleStartQuiz}
                disabled={!quiz.canAttempt}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                <PlayCircle className="w-5 h-5" />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults && results) {
    const passed = results.passed;
    const percentage = results.percentage.toFixed(1);

    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-400" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-100 mb-2">
              {passed ? 'Congratulations!' : 'Keep Trying!'}
            </h2>
            <p className="text-gray-400 mb-6">
              {passed ? 'You passed the quiz!' : 'You can try again.'}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Score</p>
                <p className="text-2xl font-bold text-gray-100">{results.score}/{results.totalPoints}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Percentage</p>
                <p className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage}%
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-1">Time</p>
                <p className="text-2xl font-bold text-gray-100">{Math.floor(results.timeSpent / 60)}m</p>
              </div>
            </div>

            {quiz.showAnswers && results.detailedResults && (
              <div className="text-left space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-100">Review Answers</h3>
                {results.detailedResults.map((result, index) => (
                  <div key={result.questionId} className={`rounded-lg p-4 border ${
                    result.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-start gap-3 mb-2">
                      {result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-100 mb-2">Question {index + 1}: {result.question}</p>
                        <p className="text-sm text-gray-400 mb-2">Your answer: {result.answer || 'Not answered'}</p>
                        {!result.isCorrect && (
                          <p className="text-sm text-gray-400 mb-2">Correct answer: {result.correctAnswer}</p>
                        )}
                        {result.explanation && (
                          <p className="text-sm text-gray-300 mt-2 bg-gray-900/50 p-2 rounded">{result.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/course/${courseId}/quizzes`)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
              >
                Back to Quizzes
              </button>
              {quiz.canAttempt && (
                <button
                  onClick={() => {
                    setShowResults(false);
                    setAttempt(null);
                    setAnswers({});
                    setCurrentQuestion(0);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking Screen
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">{quiz.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span className={timeLeft < 300 ? 'text-red-400 font-semibold' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <span className="text-gray-400">
                {currentQuestion + 1} / {quiz.questions.length}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {currentQuestion + 1}
            </div>
            <div className="flex-1">
              <p className="text-xl text-gray-100 mb-4">{question.question}</p>
              {question.codeSnippet && (
                <pre className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
                  <code className="text-sm text-gray-300">{question.codeSnippet}</code>
                </pre>
              )}
              <div className="space-y-3">
                {question.type === 'multiple-choice' && question.options.map((option) => (
                  <button
                    key={option._id}
                    onClick={() => handleAnswerSelect(question._id, { optionId: option._id, value: option.text })}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      answers[question._id]?.optionId === option._id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
                {question.type === 'true-false' && (
                  <>
                    {['True', 'False'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(question._id, { value: option })}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          answers[question._id]?.value === option
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            Previous
          </button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400 mb-3">Jump to question:</p>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[q._id]
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
