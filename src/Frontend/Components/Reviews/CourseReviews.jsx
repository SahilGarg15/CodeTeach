import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ThumbsUp, Flag, Edit2, Trash2, Loader2 } from 'lucide-react';
import { apiRequest } from '../../../config/config';
import { toast } from 'react-toastify';

const ReviewCard = ({ review, onUpdate, onDelete, currentUserId }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful?.length || 0);

  const isOwner = currentUserId === review.user?._id;

  const handleHelpful = async () => {
    try {
      const response = await apiRequest(`/api/reviews/${review._id}/helpful`, {
        method: 'POST'
      });

      if (response.success) {
        setIsHelpful(response.data.isHelpful);
        setHelpfulCount(response.data.helpfulCount);
      }
    } catch (error) {
      toast.error('Failed to mark review as helpful');
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-100">
              {review.user?.firstName} {review.user?.lastName}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-100 mb-2">{review.title}</h3>
      <p className="text-gray-300 mb-4">{review.comment}</p>

      {review.isVerifiedPurchase && (
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20 mb-4">
          Verified Purchase
        </span>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            isHelpful
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/50'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">Helpful ({helpfulCount})</span>
        </button>

        {isOwner && (
          <>
            <button
              onClick={() => onUpdate(review)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 border border-gray-600/50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ReviewForm = ({ courseId, existingReview, onSuccess, onCancel }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);

      const url = existingReview
        ? `/api/reviews/${existingReview._id}`
        : `/api/reviews/course/${courseId}`;

      const response = await apiRequest(url, {
        method: existingReview ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, title, comment })
      });

      if (response.success) {
        toast.success(response.message || 'Review submitted successfully');
        onSuccess();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600 hover:text-gray-500'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Summarize your experience"
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={5}
          placeholder="Share your thoughts about this course..."
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 characters</p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const CourseReviews = () => {
  const { courseId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchMyReview();
    fetchUserProfile();
    checkEnrollment();
  }, [courseId, sortBy]);

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

  const fetchReviews = async () => {
    try {
      const response = await apiRequest(`/api/reviews/course/${courseId}?sort=${sortBy}`);
      if (response.success) {
        setReviews(response.data);
        setStats(response.stats);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReview = async () => {
    try {
      const response = await apiRequest(`/api/reviews/course/${courseId}/my-review`);
      if (response.success && response.data) {
        setMyReview(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user review');
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

  const handleReviewSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    fetchReviews();
    fetchMyReview();
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await apiRequest(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Review deleted successfully');
        fetchReviews();
        fetchMyReview();
      }
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Course Reviews</h1>
        <p className="text-gray-400">See what students are saying about this course</p>
      </div>
      {/* Stats Section */}
      {stats && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-100">{stats.averageRating}</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(stats.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-1">{stats.totalReviews} reviews</p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-400 w-12">{rating} star</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${
                          stats.totalReviews > 0
                            ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-12">
                    {stats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Form - Show button if no review exists and form is not shown */}
      {!myReview && !showForm && !editingReview && (
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Write a Review
          </button>
        </div>
      )}

      {/* My Review - Show if user has already reviewed */}
      {myReview && !editingReview && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Your Review</h3>
          <ReviewCard
            review={myReview}
            currentUserId={currentUserId}
            onUpdate={(review) => {
              setEditingReview(review);
            }}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Review Form */}
      {(showForm || editingReview) && (
        <div className="mb-6">
          <ReviewForm
            courseId={courseId}
            existingReview={editingReview}
            onSuccess={handleReviewSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
          />
        </div>
      )}

      {/* Divider */}
      {(myReview || showForm || editingReview) && (
        <div className="border-t border-gray-700/50 my-6"></div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Reviews</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">No Reviews Yet</h3>
            <p className="text-gray-400">Be the first to review this course!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={currentUserId}
              onUpdate={(review) => {
                setEditingReview(review);
                setShowForm(false);
              }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export { ReviewCard, ReviewForm, CourseReviews };
export default CourseReviews;
