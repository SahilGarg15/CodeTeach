import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Calendar, CheckCircle, Clock, PlayCircle, Loader2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const AssignmentList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchAssignments();
    checkEnrollment();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/assignments/course/${courseId}`);
      if (response.success) {
        setAssignments(response.data);
      }
    } catch (error) {
      toast.error('Failed to load assignments');
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

  const getStatusBadge = (assignment) => {
    if (assignment.submission) {
      if (assignment.submission.status === 'graded') {
        return (
          <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Graded: {assignment.submission.score}/{assignment.totalPoints}
          </span>
        );
      }
      if (assignment.submission.status === 'pending') {
        return (
          <span className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      }
    }
    
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = now > dueDate;
    
    if (isOverdue) {
      return (
        <span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Overdue
        </span>
      );
    }
    
    return (
      <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full flex items-center gap-1">
        <FileText className="w-3 h-3" />
        Not Submitted
      </span>
    );
  };

  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days remaining`;
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
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Course Assignments</h1>
          <p className="text-gray-400">Complete assignments to demonstrate your skills</p>
        </div>

        {!enrolled && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-400">You need to enroll in this course to submit assignments.</p>
            </div>
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Assignments Yet</h3>
            <p className="text-gray-500">Check back later for assignments in this course.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const dueDate = new Date(assignment.dueDate);
              const isOverdue = new Date() > dueDate;
              
              return (
                <div
                  key={assignment._id}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-100">{assignment.title}</h3>
                        {getStatusBadge(assignment)}
                      </div>
                      <p className="text-gray-400 mb-3">{assignment.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className={isOverdue ? 'text-red-400' : 'text-gray-300'}>
                            Due {dueDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className={isOverdue ? 'text-red-400' : 'text-gray-300'}>
                            {getDaysRemaining(assignment.dueDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 capitalize">{assignment.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300">{assignment.totalPoints} points</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {assignment.submission && assignment.submission.status === 'graded' && (
                    <div className="bg-gray-900/50 rounded-lg p-4 mb-4 border border-gray-700/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Score</p>
                          <p className="text-lg font-semibold text-green-400">
                            {assignment.submission.score}/{assignment.totalPoints}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Percentage</p>
                          <p className="text-lg font-semibold text-gray-200">
                            {((assignment.submission.score / assignment.totalPoints) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Submitted</p>
                          <p className="text-sm text-gray-300">
                            {new Date(assignment.submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Graded</p>
                          <p className="text-sm text-gray-300">
                            {new Date(assignment.submission.gradedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {assignment.submission.feedback && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-xs text-gray-500 mb-1">Instructor Feedback:</p>
                          <p className="text-sm text-gray-300">{assignment.submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {assignment.submission ? (
                        <span className="text-blue-400">Submitted</span>
                      ) : enrolled ? (
                        <span className={isOverdue && !assignment.allowLateSubmissions ? 'text-red-400' : 'text-green-400'}>
                          {isOverdue && !assignment.allowLateSubmissions ? '✗ Closed' : '✓ Available'}
                        </span>
                      ) : (
                        <span className="text-gray-500">Enrollment required</span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/course/${courseId}/assignment/${assignment._id}`)}
                      disabled={!enrolled}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {assignment.submission ? 'View Submission' : 'Start Assignment'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
