import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Eye, Trash2, Flag, CheckCircle } from 'lucide-react';
import { apiRequest } from '../../../../config/config';
import { toast } from 'react-toastify';

const DiscussionModeration = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchAllDiscussions();
  }, []);

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

  const fetchAllDiscussions = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/admin/discussions');
      if (response.success) {
        setDiscussions(response.data);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (discussionId) => {
    if (!window.confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiRequest(`/api/discussions/${discussionId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Discussion deleted successfully');
        fetchAllDiscussions();
      }
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast.error('Failed to delete discussion');
    }
  };

  const filteredDiscussions = discussions.filter(disc => {
    const matchesSearch = 
      disc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disc.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disc.author?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disc.author?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = 
      filterCourse === 'all' || 
      disc.course?._id === filterCourse;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Discussion Moderation</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-gray-100">{discussions.length}</p>
                <p className="text-sm text-gray-400">Total Discussions</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-gray-100">
                  {discussions.reduce((sum, d) => sum + (d.replies?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-400">Total Replies</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Flag className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-gray-100">0</p>
                <p className="text-sm text-gray-400">Reported</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm || filterCourse !== 'all' 
                ? 'No discussions found matching your criteria' 
                : 'No discussions yet'}
            </p>
          </div>
        ) : (
          filteredDiscussions.map(discussion => (
            <div key={discussion._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-semibold text-gray-100">{discussion.title}</h3>
                  </div>
                  
                  <p className="text-gray-400 mb-3 line-clamp-2">{discussion.content}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div>
                      <span className="text-gray-500">Course:</span> {discussion.course?.title}
                    </div>
                    <div>
                      <span className="text-gray-500">Author:</span>{' '}
                      {discussion.author?.firstName} {discussion.author?.lastName}
                    </div>
                    <div>
                      <span className="text-gray-500">Replies:</span> {discussion.replies?.length || 0}
                    </div>
                    <div>
                      <span className="text-gray-500">Posted:</span>{' '}
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={`/course/${discussion.course?._id}/discussion/${discussion._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="View Discussion"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(discussion._id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Discussion"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionModeration;
