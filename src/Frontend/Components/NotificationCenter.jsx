import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, Loader2 } from 'lucide-react';
import { apiRequest } from '../../config/config';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const getIcon = () => {
    const icons = {
      enrollment: '📚',
      course_update: '🔄',
      assignment: '📝',
      quiz: '✍️',
      grade: '⭐',
      discussion_reply: '💬',
      announcement: '📢',
      certificate: '🏆',
      reminder: '⏰',
      achievement: '🎯',
      system: '⚙️'
    };
    return icons[notification.type] || '🔔';
  };

  const getPriorityColor = () => {
    const colors = {
      urgent: 'border-red-500/50 bg-red-500/10',
      high: 'border-orange-500/50 bg-orange-500/10',
      medium: 'border-blue-500/50 bg-blue-500/10',
      low: 'border-gray-500/50 bg-gray-500/10'
    };
    return colors[notification.priority] || colors.medium;
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getPriorityColor()} ${
        notification.isRead ? 'opacity-60' : ''
      } transition-all`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-gray-100 text-sm">{notification.title}</h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkRead(notification._id)}
                  title="Mark as read"
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <Check className="w-4 h-4 text-green-400" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification._id)}
                title="Delete"
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            {notification.link && (
              <Link
                to={notification.link}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter !== 'all') {
        queryParams.append('isRead', filter === 'read' ? 'true' : 'false');
      }
      
      const response = await apiRequest(`/api/notifications?${queryParams}`);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await apiRequest('/api/notifications/unread-count');
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const response = await apiRequest(`/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (response.success) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await apiRequest('/api/notifications/mark-all-read', {
        method: 'PUT'
      });
      if (response.success) {
        toast.success('All notifications marked as read');
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiRequest(`/api/notifications/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleClearRead = async () => {
    if (!window.confirm('Clear all read notifications?')) return;
    
    try {
      const response = await apiRequest('/api/notifications/clear-read', {
        method: 'DELETE'
      });
      if (response.success) {
        toast.success(response.message);
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-4 top-16 w-96 max-h-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-4 border-b border-gray-700">
              {['all', 'unread', 'read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex gap-2 px-4 py-2 border-b border-gray-700">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={handleClearRead}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationCenter;
