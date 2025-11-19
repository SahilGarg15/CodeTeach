import Notification from '../models/Notification.js';
import { getPagination } from '../utils/helpers.js';

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { page, limit, type, isRead, priority } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const query = { user: req.user.id };
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (priority) query.priority = priority;

    const notifications = await Notification.find(query)
      .populate('relatedCourse', 'title courseId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,    
      isRead: false
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
export const clearReadNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({
      user: req.user.id,
      isRead: true
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} read notifications`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notification preferences (placeholder for future)
// @route   GET /api/notifications/preferences
// @access  Private
export const getPreferences = async (req, res, next) => {
  try {
    // TODO: Implement notification preferences
    // For now, return default preferences
    const preferences = {
      email: {
        enrollment: true,
        course_update: true,
        assignment: true,
        quiz: true,
        grade: true,
        discussion_reply: true,
        announcement: true,
        certificate: true,
        reminder: true
      },
      push: {
        enrollment: true,
        assignment: true,
        quiz: true,
        grade: true,
        discussion_reply: true
      }
    };

    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notification preferences (placeholder for future)
// @route   PUT /api/notifications/preferences
// @access  Private
export const updatePreferences = async (req, res, next) => {
  try {
    // TODO: Implement notification preferences update
    res.status(200).json({
      success: true,
      message: 'Notification preferences updated',
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};
