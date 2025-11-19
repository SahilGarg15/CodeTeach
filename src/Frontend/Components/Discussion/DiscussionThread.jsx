import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageCircle, CheckCircle, Edit2, Trash2, X, ArrowLeft, Lock, Unlock, Loader2 } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const DiscussionThread = () => {
  const { courseId, discussionId } = useParams();
  const navigate = useNavigate();
  
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchDiscussion();
    fetchUserProfile();
  }, [discussionId]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiRequest('/api/users/profile');
      if (response.success) {
        setCurrentUserId(response.data._id);
      }
    } catch (error) {
      console.error('Failed to fetch user profile');
    }
  };

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/discussions/${discussionId}`);
      if (response.success) {
        setDiscussion(response.data);
      }
    } catch (error) {
      toast.error('Failed to load discussion');
      navigate(`/course/${courseId}/discussions`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const response = await apiRequest(`/api/discussions/${discussionId}/upvote`, {
        method: 'POST'
      });
      if (response.success) {
        fetchDiscussion();
      }
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleReplyUpvote = async (replyId) => {
    try {
      const response = await apiRequest(`/api/discussions/${discussionId}/reply/${replyId}/upvote`, {
        method: 'POST'
      });
      if (response.success) {
        fetchDiscussion();
      }
    } catch (error) {
      toast.error('Failed to upvote reply');
    }
  };

  const handleAcceptReply = async (replyId) => {
    try {
      const response = await apiRequest(`/api/discussions/${discussionId}/reply/${replyId}/accept`, {
        method: 'POST'
      });
      if (response.success) {
        toast.success('Reply marked as solution');
        fetchDiscussion();
      }
    } catch (error) {
      toast.error('Failed to accept reply');
    }
  };

  const handleToggleClose = async () => {
    try {
      const response = await apiRequest(`/api/discussions/${discussionId}/close`, {
        method: 'POST'
      });
      if (response.success) {
        toast.success(response.message);
        fetchDiscussion();
      }
    } catch (error) {
      toast.error('Failed to toggle discussion status');
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiRequest(`/api/discussions/${discussionId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content: replyContent })
      });

      if (response.success) {
        toast.success('Reply posted successfully');
        setReplyContent('');
        fetchDiscussion();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;

    try {
      const response = await apiRequest(`/api/discussions/${discussionId}/reply/${replyId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Reply deleted');
        fetchDiscussion();
      }
    } catch (error) {
      toast.error('Failed to delete reply');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!discussion) {
    return null;
  }

  const isOwner = currentUserId === discussion.user?._id;
  const isUpvoted = discussion.upvotes?.includes(currentUserId);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/course/${courseId}/discussions`)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Discussions
        </button>

        {/* Discussion Header */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-md text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {discussion.category}
                </span>
                {discussion.isSolved && (
                  <span className="px-3 py-1 rounded-md text-sm bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Solved
                  </span>
                )}
                {discussion.isClosed && (
                  <span className="px-3 py-1 rounded-md text-sm bg-gray-500/10 text-gray-400 border border-gray-500/20 flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    Closed
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-100 mb-3">{discussion.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <img
                    src={discussion.user?.avatar || `https://ui-avatars.com/api/?name=${discussion.user?.firstName}+${discussion.user?.lastName}`}
                    alt={`${discussion.user?.firstName} ${discussion.user?.lastName}`}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{discussion.user?.firstName} {discussion.user?.lastName}</span>
                </div>
                <span>•</span>
                <span>{new Date(discussion.createdAt).toLocaleString()}</span>
                <span>•</span>
                <span>{discussion.views} views</span>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={handleToggleClose}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors"
              >
                {discussion.isClosed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {discussion.isClosed ? 'Reopen' : 'Close'}
              </button>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-4">
            <p className="text-gray-300 whitespace-pre-wrap">{discussion.content}</p>
          </div>

          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {discussion.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-sm bg-gray-700/50 text-gray-400 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isUpvoted
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/50'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{discussion.upvotes?.length || 0}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span>{discussion.replies?.length || 0} replies</span>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-100">
            Replies ({discussion.replies?.length || 0})
          </h2>
          
          {discussion.replies && discussion.replies.length > 0 ? (
            discussion.replies.map((reply) => {
              const isReplyUpvoted = reply.upvotes?.includes(currentUserId);
              const isReplyOwner = currentUserId === reply.user?._id;

              return (
                <div
                  key={reply._id}
                  className={`bg-gray-800/50 rounded-lg p-6 border ${
                    reply.isAccepted ? 'border-green-500/50 bg-green-500/5' : 'border-gray-700/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={reply.user?.avatar || `https://ui-avatars.com/api/?name=${reply.user?.firstName}+${reply.user?.lastName}`}
                      alt={`${reply.user?.firstName} ${reply.user?.lastName}`}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-100">
                          {reply.user?.firstName} {reply.user?.lastName}
                        </span>
                        {reply.isInstructorReply && (
                          <span className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                            Instructor
                          </span>
                        )}
                        {reply.isAccepted && (
                          <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Accepted Answer
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4 whitespace-pre-wrap">{reply.content}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleReplyUpvote(reply._id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            isReplyUpvoted
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/50'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{reply.upvotes?.length || 0}</span>
                        </button>
                        {isOwner && !reply.isAccepted && !discussion.isClosed && (
                          <button
                            onClick={() => handleAcceptReply(reply._id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept Answer
                          </button>
                        )}
                        {isReplyOwner && (
                          <button
                            onClick={() => handleDeleteReply(reply._id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No replies yet. Be the first to reply!</p>
            </div>
          )}
        </div>

        {/* Reply Form */}
        {!discussion.isClosed && (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Add Your Reply</h3>
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts or solution..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none mb-4"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Post Reply
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionThread;
