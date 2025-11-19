import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Calendar, Clock, Award, CheckCircle, XCircle, Upload, 
  Download, Eye, Code, Loader2, AlertCircle, Trophy 
} from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const AssignmentInterface = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    submissionUrl: '',
    files: []
  });

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
      fetchSubmission();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/assignments/${assignmentId}`);
      if (response.success) {
        setAssignment(response.data);
      }
    } catch (error) {
      toast.error('Failed to load assignment');
      navigate(`/course/${courseId}/assignments`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmission = async () => {
    try {
      const response = await apiRequest(`/api/assignments/${assignmentId}/my-submission`);
      if (response.success && response.data) {
        setSubmission(response.data);
      }
    } catch (error) {
      console.error('No submission found:', error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content && !formData.submissionUrl && formData.files.length === 0) {
      toast.error('Please provide submission content, URL, or upload files');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = new FormData();
      submitData.append('content', formData.content);
      submitData.append('submissionUrl', formData.submissionUrl);
      
      formData.files.forEach(file => {
        submitData.append('files', file);
      });

      const response = await apiRequest(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: submitData,
        isFormData: true
      });

      if (response.success) {
        toast.success('Assignment submitted successfully!');
        setShowSubmitModal(false);
        fetchSubmission();
        setFormData({ content: '', submissionUrl: '', files: [] });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-600', icon: Clock, text: 'Pending Review' },
      graded: { color: 'bg-blue-600', icon: CheckCircle, text: 'Graded' },
      late: { color: 'bg-orange-600', icon: AlertCircle, text: 'Late Submission' },
      resubmit: { color: 'bg-red-600', icon: XCircle, text: 'Resubmit Required' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`${config.color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const isLate = () => {
    if (!assignment?.dueDate) return false;
    return new Date() > new Date(assignment.dueDate);
  };

  const canSubmit = () => {
    if (!assignment) return false;
    if (!assignment.allowLateSubmissions && isLate()) return false;
    if (!assignment.allowResubmission && submission) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!assignment) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700/50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-100 mb-2">{assignment.title}</h1>
              <p className="text-gray-400">{assignment.description}</p>
            </div>
            {submission && (
              <div className="ml-4">
                {getStatusBadge(submission.status)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className={`text-sm font-semibold ${isLate() ? 'text-red-400' : 'text-gray-200'}`}>
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-500">Total Points</p>
                <p className="text-sm font-semibold text-gray-200">{assignment.totalPoints}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-semibold text-gray-200 capitalize">{assignment.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-semibold text-gray-200">
                  {submission ? 'Submitted' : isLate() ? 'Overdue' : 'Not Submitted'}
                </p>
              </div>
            </div>
          </div>

          {isLate() && !submission && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 text-sm">
                  This assignment is overdue. 
                  {assignment.allowLateSubmissions && ` Late submissions will receive a ${assignment.lateSubmissionPenalty}% penalty.`}
                  {!assignment.allowLateSubmissions && ' Late submissions are not accepted.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Instructions</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{assignment.instructions}</p>
              </div>

              {assignment.resources.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">Resources</h3>
                  <div className="space-y-2">
                    {assignment.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors border border-gray-700/50"
                      >
                        <Download className="w-5 h-5 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-gray-200 font-medium">{resource.title}</p>
                          {resource.description && (
                            <p className="text-sm text-gray-400">{resource.description}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rubric */}
            {assignment.rubric.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Grading Rubric</h2>
                <div className="space-y-3">
                  {assignment.rubric.map((criterion, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-200">{criterion.criterion}</h3>
                        <span className="text-blue-400 font-semibold">{criterion.points} pts</span>
                      </div>
                      <p className="text-sm text-gray-400">{criterion.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Cases (for code assignments) */}
            {assignment.type === 'code' && assignment.testCases.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Test Cases</h2>
                <div className="space-y-3">
                  {assignment.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-200">Test Case {index + 1}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          testCase.isHidden ? 'bg-gray-700 text-gray-300' : 'bg-blue-600 text-white'
                        }`}>
                          {testCase.isHidden ? 'Hidden' : 'Visible'}
                        </span>
                      </div>
                      {!testCase.isHidden && (
                        <>
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Input:</p>
                            <code className="text-sm text-gray-300 bg-gray-900 px-2 py-1 rounded">
                              {testCase.input}
                            </code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Expected Output:</p>
                            <code className="text-sm text-gray-300 bg-gray-900 px-2 py-1 rounded">
                              {testCase.expectedOutput}
                            </code>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Status */}
            {submission ? (
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Your Submission</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Submitted</p>
                    <p className="text-gray-200">{new Date(submission.submittedAt).toLocaleString()}</p>
                  </div>

                  {submission.status === 'graded' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Score</p>
                        <p className="text-2xl font-bold text-green-400">
                          {submission.score} / {assignment.totalPoints}
                        </p>
                      </div>
                      {submission.feedback && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Feedback</p>
                          <p className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {submission.content && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Content</p>
                      <p className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded max-h-40 overflow-y-auto">
                        {submission.content}
                      </p>
                    </div>
                  )}

                  {submission.submissionUrl && (
                    <a
                      href={submission.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                      View Submission
                    </a>
                  )}

                  {assignment.allowResubmission && submission.status !== 'graded' && canSubmit() && (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                    >
                      Resubmit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Submit Assignment</h2>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  disabled={!canSubmit()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                >
                  <Upload className="w-5 h-5" />
                  Submit Assignment
                </button>
                {!canSubmit() && (
                  <p className="text-sm text-gray-400 mt-2">
                    {isLate() && !assignment.allowLateSubmissions
                      ? 'Late submissions not accepted'
                      : 'Resubmissions not allowed'}
                  </p>
                )}
              </div>
            )}

            {/* Assignment Info */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="font-semibold text-gray-100 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Attempts</span>
                  <span className="text-gray-200">{assignment.maxAttempts || 'Unlimited'}</span>
                </div>
                {submission && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attempts Used</span>
                    <span className="text-gray-200">{submission.attemptNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Late Penalty</span>
                  <span className="text-gray-200">{assignment.lateSubmissionPenalty}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Auto-Grade</span>
                  <span className={assignment.autoGrade ? 'text-green-400' : 'text-gray-400'}>
                    {assignment.autoGrade ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Submit Assignment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {assignment.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                    placeholder="Type your answer here..."
                  />
                </div>
              )}

              {assignment.type === 'code' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Code
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 font-mono text-sm focus:outline-none focus:border-blue-500"
                    placeholder="// Paste your code here..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Submission URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.submissionUrl}
                  onChange={(e) => setFormData({ ...formData, submissionUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {assignment.type === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                  {formData.files.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      {formData.files.length} file(s) selected
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setFormData({ content: '', submissionUrl: '', files: [] });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentInterface;
