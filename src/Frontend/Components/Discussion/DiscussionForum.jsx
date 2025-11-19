import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Plus, Search, Filter, ThumbsUp, MessageCircle, CheckCircle, Lock, Pin, Loader2 } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const DiscussionCard = ({ discussion, onClick }) => {
  const getCategoryColor = () => {
    const colors = {
      'Question': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Discussion': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Bug': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Feature Request': 'bg-green-500/10 text-green-400 border-green-500/20',
      'General': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };
    return colors[discussion.category] || colors.General;
  };

  return (
    <div
      onClick={() => onClick(discussion._id)}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 cursor-pointer transition-all"
    >
      <div className="flex items-start gap-3">
        {discussion.isPinned && <Pin className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-md text-xs border ${getCategoryColor()}`}>
              {discussion.category}
            </span>
            {discussion.isSolved && (
              <span className="px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Solved
              </span>
            )}
            {discussion.isClosed && (
              <span className="px-2 py-1 rounded-md text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Closed
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-1 line-clamp-2">{discussion.title}</h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{discussion.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <img
                src={discussion.user?.avatar || `https://ui-avatars.com/api/?name=${discussion.user?.firstName}+${discussion.user?.lastName}`}
                alt={`${discussion.user?.firstName} ${discussion.user?.lastName}`}
                className="w-5 h-5 rounded-full"
              />
              <span>{discussion.user?.firstName} {discussion.user?.lastName}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {discussion.upvotes?.length || 0}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {discussion.replies?.length || 0}
            </div>
            <div className="flex items-center gap-1">
              <span>{discussion.views || 0} views</span>
            </div>
            <span className="ml-auto">{new Date(discussion.lastActivity).toLocaleDateString()}</span>
          </div>
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {discussion.tags.map((tag, index) => (
                <span key={index} className="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-400 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DiscussionForum = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['All', 'Question', 'Discussion', 'Bug', 'Feature Request', 'General'];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'mostVoted', label: 'Most Voted' },
    { value: 'mostReplies', label: 'Most Replies' }
  ];

  useEffect(() => {
    fetchDiscussions();
  }, [courseId, category, sortBy, searchTerm]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (sortBy) params.append('sort', sortBy);
      if (searchTerm) params.append('search', searchTerm);

      const response = await apiRequest(`/api/discussions/course/${courseId}?${params}`);
      if (response.success) {
        setDiscussions(response.data);
      }
    } catch (error) {
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscussionClick = (discussionId) => {
    navigate(`/course/${courseId}/discussion/${discussionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Discussion Forum</h1>
            <p className="text-gray-400">Ask questions and share knowledge with the community</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Discussion
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Discussions List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">No discussions yet</h3>
            <p className="text-gray-400 mb-4">Be the first to start a discussion!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Start Discussion
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <DiscussionCard
                key={discussion._id}
                discussion={discussion}
                onClick={handleDiscussionClick}
              />
            ))}
          </div>
        )}

        {/* Create Discussion Modal */}
        {showCreateModal && (
          <CreateDiscussionModal
            courseId={courseId}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchDiscussions();
            }}
          />
        )}
      </div>
    </div>
  );
};

const CreateDiscussionModal = ({ courseId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Question',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await apiRequest(`/api/discussions/course/${courseId}`, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          tags
        })
      });

      if (response.success) {
        toast.success('Discussion created successfully');
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create discussion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Start a New Discussion</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Question">Question</option>
                <option value="Discussion">Discussion</option>
                <option value="Bug">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What's your question or topic?"
                maxLength={200}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Provide more details..."
                rows={6}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Separate tags with commas (e.g., java, loops, arrays)"
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Post Discussion
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;
