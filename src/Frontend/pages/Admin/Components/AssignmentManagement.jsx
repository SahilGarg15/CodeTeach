import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Calendar, Award } from 'lucide-react';
import { apiRequest } from '../../../../config/config';
import { toast } from 'react-toastify';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    course: '',
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    totalPoints: 100,
    passingPoints: 70,
    allowLateSubmission: false,
    lateSubmissionDeadline: '',
    latePenalty: 10,
    isPublished: false,
    rubric: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssignments(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await apiRequest('/api/courses');
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/assignments/course/${courseId}`);
      if (response.success) {
        setAssignments(response.data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAssignment 
        ? `/api/assignments/${editingAssignment._id}`
        : '/api/assignments';
      
      const method = editingAssignment ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(assignmentForm)
      });

      if (response.success) {
        toast.success(editingAssignment ? 'Assignment updated successfully' : 'Assignment created successfully');
        setShowForm(false);
        resetForm();
        fetchAssignments(selectedCourse);
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error('Failed to save assignment');
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const response = await apiRequest(`/api/assignments/${assignmentId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Assignment deleted successfully');
        fetchAssignments(selectedCourse);
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      course: assignment.course._id || assignment.course,
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
      totalPoints: assignment.totalPoints,
      passingPoints: assignment.passingPoints,
      allowLateSubmission: assignment.allowLateSubmission,
      lateSubmissionDeadline: assignment.lateSubmissionDeadline ? new Date(assignment.lateSubmissionDeadline).toISOString().slice(0, 16) : '',
      latePenalty: assignment.latePenalty,
      isPublished: assignment.isPublished,
      rubric: assignment.rubric || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingAssignment(null);
    setAssignmentForm({
      course: selectedCourse,
      title: '',
      description: '',
      instructions: '',
      dueDate: '',
      totalPoints: 100,
      passingPoints: 70,
      allowLateSubmission: false,
      lateSubmissionDeadline: '',
      latePenalty: 10,
      isPublished: false,
      rubric: []
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Assignment Management</h2>
        
        {/* Course Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <button
            onClick={() => {
              setAssignmentForm({ ...assignmentForm, course: selectedCourse });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Assignment
          </button>
        )}
      </div>

      {/* Assignment List */}
      {selectedCourse && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No assignments found for this course</p>
            </div>
          ) : (
            assignments.map(assignment => (
              <div key={assignment._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">{assignment.title}</h3>
                    <p className="text-gray-400 mb-4">{assignment.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>{assignment.totalPoints} points</span>
                      </div>
                      {assignment.dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        assignment.isPublished 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {assignment.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Assignment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full my-8">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Points *
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.totalPoints}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, totalPoints: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Passing Points *
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.passingPoints}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, passingPoints: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Late Penalty (%)
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.latePenalty}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, latePenalty: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instructions
                </label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowLateSubmission"
                    checked={assignmentForm.allowLateSubmission}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, allowLateSubmission: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="allowLateSubmission" className="text-sm font-medium text-gray-300">
                    Allow late submission
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={assignmentForm.isPublished}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-300">
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;
