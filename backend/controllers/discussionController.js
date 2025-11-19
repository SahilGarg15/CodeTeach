import Discussion from '../models/Discussion.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';
import { getPagination } from '../utils/helpers.js';

// @desc    Get all discussions for a course
// @route   GET /api/discussions/course/:courseId
// @access  Public
export const getCourseDiscussions = async (req, res, next) => {
  try {
    const { page, limit, sort, category, moduleId, topicId, search } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    // Build query
    const query = { course: req.params.courseId };
    
    if (category) query.category = category;
    if (moduleId) query['module.moduleId'] = moduleId;
    if (topicId) query['topic.topicId'] = topicId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = { isPinned: -1, lastActivity: -1 };
    if (sort === 'newest') {
      sortOption = { isPinned: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { isPinned: -1, createdAt: 1 };
    } else if (sort === 'mostVoted') {
      sortOption = { isPinned: -1, 'upvotes.length': -1 };
    } else if (sort === 'mostReplies') {
      sortOption = { isPinned: -1, 'replies.length': -1 };
    }

    const discussions = await Discussion.find(query)
      .populate('user', 'firstName lastName avatar')
      .populate('replies.user', 'firstName lastName avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Discussion.countDocuments(query);

    res.status(200).json({
      success: true,
      count: discussions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: discussions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Public
export const getDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('user', 'firstName lastName avatar role')
      .populate('replies.user', 'firstName lastName avatar role')
      .populate('course', 'title courseId');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Increment views
    discussion.views += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a discussion
// @route   POST /api/discussions/course/:courseId
// @access  Private
export const createDiscussion = async (req, res, next) => {
  try {
    const { title, content, category, tags, module, topic } = req.body;

    // Check if course exists
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (optional - allow non-enrolled users to ask questions)
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    const discussion = await Discussion.create({
      user: req.user.id,
      course: req.params.courseId,
      title,
      content,
      category,
      tags,
      module,
      topic
    });

    await discussion.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a discussion
// @route   PUT /api/discussions/:id
// @access  Private
export const updateDiscussion = async (req, res, next) => {
  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check ownership
    if (discussion.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discussion'
      });
    }

    const { title, content, tags } = req.body;

    discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { title, content, tags },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      message: 'Discussion updated successfully',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private
export const deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check ownership or admin
    if (discussion.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion'
      });
    }

    await discussion.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reply to discussion
// @route   POST /api/discussions/:id/reply
// @access  Private
export const addReply = async (req, res, next) => {
  try {
    const { content } = req.body;

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    if (discussion.isClosed) {
      return res.status(400).json({
        success: false,
        message: 'This discussion is closed'
      });
    }

    const isInstructor = req.user.role === 'admin' || req.user.role === 'instructor';

    discussion.replies.push({
      user: req.user.id,
      content,
      isInstructorReply: isInstructor,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await discussion.save();
    await discussion.populate('replies.user', 'firstName lastName avatar role');

    // Create notification for discussion creator
    if (discussion.user.toString() !== req.user.id) {
      await Notification.createNotification({
        user: discussion.user,
        type: 'discussion_reply',
        title: 'New reply to your discussion',
        message: `${req.user.firstName} replied to "${discussion.title}"`,
        link: `/courses/${discussion.course}/discussions/${discussion._id}`,
        relatedDiscussion: discussion._id,
        relatedCourse: discussion.course
      });
    }

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reply
// @route   PUT /api/discussions/:id/reply/:replyId
// @access  Private
export const updateReply = async (req, res, next) => {
  try {
    const { content } = req.body;

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const reply = discussion.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check ownership
    if (reply.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reply'
      });
    }

    reply.content = content;
    reply.updatedAt = Date.now();

    await discussion.save();

    res.status(200).json({
      success: true,
      message: 'Reply updated successfully',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reply
// @route   DELETE /api/discussions/:id/reply/:replyId
// @access  Private
export const deleteReply = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const reply = discussion.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check ownership or admin
    if (reply.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reply'
      });
    }

    reply.deleteOne();
    await discussion.save();

    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote discussion
// @route   POST /api/discussions/:id/upvote
// @access  Private
export const upvoteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const alreadyUpvoted = discussion.upvotes.includes(req.user.id);

    if (alreadyUpvoted) {
      discussion.upvotes = discussion.upvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      discussion.upvotes.push(req.user.id);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      message: alreadyUpvoted ? 'Upvote removed' : 'Discussion upvoted',
      data: {
        upvotes: discussion.upvotes.length,
        isUpvoted: !alreadyUpvoted
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote reply
// @route   POST /api/discussions/:id/reply/:replyId/upvote
// @access  Private
export const upvoteReply = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const reply = discussion.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    const alreadyUpvoted = reply.upvotes.includes(req.user.id);

    if (alreadyUpvoted) {
      reply.upvotes = reply.upvotes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      reply.upvotes.push(req.user.id);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      message: alreadyUpvoted ? 'Upvote removed' : 'Reply upvoted',
      data: {
        upvotes: reply.upvotes.length,
        isUpvoted: !alreadyUpvoted
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark reply as accepted (solution)
// @route   POST /api/discussions/:id/reply/:replyId/accept
// @access  Private
export const acceptReply = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Only discussion creator or admin can accept
    if (discussion.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept replies'
      });
    }

    const reply = discussion.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Unaccept all other replies
    discussion.replies.forEach(r => {
      r.isAccepted = false;
    });

    // Accept this reply
    reply.isAccepted = true;
    discussion.isSolved = true;

    await discussion.save();

    // Notify reply author
    if (reply.user.toString() !== req.user.id) {
      await Notification.createNotification({
        user: reply.user,
        type: 'discussion_reply',
        title: 'Your reply was accepted',
        message: `Your reply to "${discussion.title}" was marked as the solution`,
        link: `/courses/${discussion.course}/discussions/${discussion._id}`,
        relatedDiscussion: discussion._id,
        relatedCourse: discussion.course
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reply marked as solution',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Close discussion
// @route   POST /api/discussions/:id/close
// @access  Private (Admin/Owner)
export const closeDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Only discussion creator or admin can close
    if (discussion.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to close this discussion'
      });
    }

    discussion.isClosed = !discussion.isClosed;
    await discussion.save();

    res.status(200).json({
      success: true,
      message: discussion.isClosed ? 'Discussion closed' : 'Discussion reopened',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};
