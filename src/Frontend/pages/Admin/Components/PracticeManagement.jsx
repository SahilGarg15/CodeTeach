import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Code2, TrendingUp, Award, Search } from 'lucide-react';
import { apiRequest } from '../../../../config/config';
import { toast } from 'react-toastify';

const PracticeManagement = () => {
  const [practices, setPractices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPractice, setEditingPractice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [practiceForm, setPracticeForm] = useState({
    course: '',
    title: '',
    description: '',
    difficulty: 'Medium',
    questions: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchPractices(selectedCourse);
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

  const fetchPractices = async (courseId) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/practice/course/${courseId}`);
      if (response.success) {
        setPractices(response.data);
      }
    } catch (error) {
      console.error('Error fetching practices:', error);
      toast.error('Failed to load practice sets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPractice 
        ? `/api/practice/${editingPractice._id}`
        : '/api/practice';
      
      const method = editingPractice ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(practiceForm)
      });

      if (response.success) {
        toast.success(editingPractice ? 'Practice set updated successfully' : 'Practice set created successfully');
        setShowForm(false);
        resetForm();
        fetchPractices(selectedCourse);
      }
    } catch (error) {
      console.error('Error saving practice:', error);
      toast.error('Failed to save practice set');
    }
  };

  const handleDelete = async (practiceId) => {
    if (!window.confirm('Are you sure you want to delete this practice set?')) return;

    try {
      const response = await apiRequest(`/api/practice/${practiceId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Practice set deleted successfully');
        fetchPractices(selectedCourse);
      }
    } catch (error) {
      console.error('Error deleting practice:', error);
      toast.error('Failed to delete practice set');
    }
  };

  const handleEdit = (practice) => {
    setEditingPractice(practice);
    setPracticeForm({
      course: practice.course._id || practice.course,
      title: practice.title,
      description: practice.description,
      difficulty: practice.difficulty || 'Medium',
      questions: practice.questions || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingPractice(null);
    setPracticeForm({
      course: selectedCourse,
      title: '',
      description: '',
      difficulty: 'Medium',
      questions: []
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Practice Set Management</h2>
        
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
              setPracticeForm({ ...practiceForm, course: selectedCourse });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Practice Set
          </button>
        )}
      </div>

      {/* Practice List */}
      {selectedCourse && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : practices.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No practice sets found for this course</p>
            </div>
          ) : (
            practices.map(practice => (
              <div key={practice._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">{practice.title}</h3>
                    <p className="text-gray-400 mb-4">{practice.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        <span>{practice.questions?.length || 0} Questions</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        practice.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        practice.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {practice.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(practice)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(practice._id)}
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

      {/* Practice Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full my-8">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              {editingPractice ? 'Edit Practice Set' : 'Create New Practice Set'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={practiceForm.title}
                    onChange={(e) => setPracticeForm({ ...practiceForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={practiceForm.difficulty}
                    onChange={(e) => setPracticeForm({ ...practiceForm, difficulty: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={practiceForm.description}
                  onChange={(e) => setPracticeForm({ ...practiceForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="border-t border-gray-700 pt-6">
                <p className="text-sm text-gray-400 mb-4">
                  Note: You can add practice questions and configure test cases after creating the practice set.
                </p>
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
                  {editingPractice ? 'Update Practice Set' : 'Create Practice Set'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeManagement;
