import Progress from '../models/Progress.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// @desc    Get user's progress for a course
// @route   GET /api/progress/course/:courseId
// @access  Private
export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must enroll in this course first'
      });
    }

    const progressRecords = await Progress.find({
      user: req.user.id,
      course: courseId
    }).sort({ lastAccessedAt: -1 });

    const totalTimeSpent = progressRecords.reduce((sum, record) => sum + record.timeSpent, 0);

    res.status(200).json({
      success: true,
      data: {
        overall: {
          progress: enrollment.progress,
          completedTopics: enrollment.completedTopics.length,
          totalTimeSpent: totalTimeSpent,
          status: enrollment.status
        },
        topics: progressRecords
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update topic progress
// @route   POST /api/progress
// @access  Private
export const updateProgress = async (req, res, next) => {
  try {
    const { courseId, topicId, moduleId, status, timeSpent, notes } = req.body;

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must enroll in this course first'
      });
    }

    // Update or create progress
    const progressData = {
      user: req.user.id,
      course: courseId,
      topicId,
      moduleId,
      status: status || 'in-progress',
      lastAccessedAt: new Date()
    };

    if (timeSpent !== undefined) {
      progressData.$inc = { timeSpent: timeSpent };
    }

    if (notes !== undefined) {
      progressData.notes = notes;
    }

    if (status === 'completed') {
      progressData.completedAt = new Date();
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, course: courseId, topicId },
      progressData,
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get topic progress
// @route   GET /api/progress/topic/:courseId/:topicId
// @access  Private
export const getTopicProgress = async (req, res, next) => {
  try {
    const { courseId, topicId } = req.params;

    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId,
      topicId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress found for this topic'
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall user progress statistics
// @route   GET /api/progress/stats
// @access  Private
export const getOverallProgressStats = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course', 'title category thumbnail');

    const allProgress = await Progress.find({ user: req.user.id });

    const stats = {
      totalCourses: enrollments.length,
      activeCourses: enrollments.filter(e => e.status === 'active').length,
      completedCourses: enrollments.filter(e => e.status === 'completed').length,
      totalTopicsCompleted: allProgress.filter(p => p.status === 'completed').length,
      totalTimeSpent: allProgress.reduce((sum, p) => sum + p.timeSpent, 0),
      averageProgress: enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
        : 0,
      courseProgress: enrollments.map(e => ({
        courseId: e.course._id,
        title: e.course.title,
        category: e.course.category,
        thumbnail: e.course.thumbnail,
        progress: e.progress,
        status: e.status,
        lastAccessedAt: e.lastAccessedAt
      }))
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete progress for a topic
// @route   DELETE /api/progress/:progressId
// @access  Private
export const deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.progressId,
      user: req.user.id
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    await progress.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Progress deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress by module
// @route   GET /api/progress/module/:courseId/:moduleId
// @access  Private
export const getModuleProgress = async (req, res, next) => {
  try {
    const { courseId, moduleId } = req.params;

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must enroll in this course first'
      });
    }

    const progressRecords = await Progress.find({
      user: req.user.id,
      course: courseId,
      moduleId
    }).sort({ lastAccessedAt: -1 });

    // Get course to count topics in module
    const course = await Course.findById(courseId);
    const module = course.modules.find(m => m.moduleId === moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const completedTopics = progressRecords.filter(p => p.status === 'completed').length;
    const totalTopics = module.topics.length;
    const moduleProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        moduleId,
        title: module.title,
        progress: moduleProgress,
        completedTopics,
        totalTopics,
        topics: progressRecords
      }
    });
  } catch (error) {
    next(error);
  }
};
