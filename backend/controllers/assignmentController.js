import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';
import { getPagination } from '../utils/helpers.js';

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
export const getCourseAssignments = async (req, res, next) => {
  try {
    const { moduleId, topicId } = req.query;

    const query = { course: req.params.courseId, isActive: true };
    if (moduleId) query['module.moduleId'] = moduleId;
    if (topicId) query['topic.topicId'] = topicId;

    const assignments = await Assignment.find(query)
      .sort({ 'module.moduleId': 1, dueDate: 1 });

    // Get user's submissions for each assignment
    const assignmentsWithSubmissions = await Promise.all(
      assignments.map(async (assignment) => {
        const submissions = await AssignmentSubmission.find({
          user: req.user.id,
          assignment: assignment._id
        }).sort({ attemptNumber: -1 });

        const now = new Date();
        const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < now;

        return {
          ...assignment.toObject(),
          submissions: submissions.length,
          maxAttempts: assignment.maxAttempts,
          canSubmit: assignment.maxAttempts === 0 || submissions.length < assignment.maxAttempts,
          bestScore: submissions.length > 0 
            ? Math.max(...submissions.filter(s => s.finalScore !== null).map(s => s.finalScore))
            : null,
          latestSubmission: submissions[0] || null,
          isOverdue,
          daysUntilDue: assignment.dueDate 
            ? Math.ceil((new Date(assignment.dueDate) - now) / (1000 * 60 * 60 * 24))
            : null
        };
      })
    );

    res.status(200).json({
      success: true,
      count: assignmentsWithSubmissions.length,
      data: assignmentsWithSubmissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
export const getAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: assignment.course
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access assignments'
      });
    }

    // Get user's submissions
    const submissions = await AssignmentSubmission.find({
      user: req.user.id,
      assignment: assignment._id
    }).sort({ attemptNumber: -1 });

    const canSubmit = assignment.maxAttempts === 0 || submissions.length < assignment.maxAttempts;

    res.status(200).json({
      success: true,
      data: {
        ...assignment.toObject(),
        submissions,
        canSubmit
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private
export const submitAssignment = async (req, res, next) => {
  try {
    const { content, code, language, files } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: assignment.course
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course'
      });
    }

    // Check submission count
    const submissionCount = await AssignmentSubmission.countDocuments({
      user: req.user.id,
      assignment: assignment._id
    });

    if (assignment.maxAttempts > 0 && submissionCount >= assignment.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: 'Maximum submission attempts reached'
      });
    }

    // Check due date
    const now = new Date();
    let isLate = false;
    let latePenalty = 0;

    if (assignment.dueDate) {
      const dueDate = new Date(assignment.dueDate);
      if (now > dueDate) {
        if (!assignment.allowLateSubmission) {
          return res.status(400).json({
            success: false,
            message: 'Assignment submission deadline has passed'
          });
        }
        isLate = true;
        const daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
        latePenalty = Math.min(daysLate * assignment.lateSubmissionPenalty, 100);
      }
    }

    // Create submission
    const submission = await AssignmentSubmission.create({
      assignment: assignment._id,
      user: req.user.id,
      course: assignment.course,
      attemptNumber: submissionCount + 1,
      content,
      code,
      language,
      files,
      isLate,
      latePenalty,
      status: assignment.autoGrade ? 'grading' : 'submitted'
    });

    // Auto-grade if enabled and test cases available
    if (assignment.autoGrade && assignment.testCases && assignment.testCases.length > 0) {
      // TODO: Implement auto-grading logic
      // For now, set status to submitted
      submission.status = 'submitted';
      await submission.save();
    }

    // Notify instructors
    await Notification.createNotification({
      user: req.user.id,
      type: 'assignment',
      title: 'Assignment Submitted',
      message: `You submitted "${assignment.title}"`,
      link: `/courses/${assignment.course}/assignments/${assignment._id}/submissions/${submission._id}`,
      relatedAssignment: assignment._id,
      relatedCourse: assignment.course
    });

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submission by ID
// @route   GET /api/assignments/submissions/:submissionId
// @access  Private
export const getSubmission = async (req, res, next) => {
  try {
    const submission = await AssignmentSubmission.findById(req.params.submissionId)
      .populate('assignment')
      .populate('user', 'firstName lastName email')
      .populate('gradedBy', 'firstName lastName')
      .populate('course', 'title courseId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check authorization
    if (submission.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this submission'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's submissions for a course
// @route   GET /api/assignments/course/:courseId/my-submissions
// @access  Private
export const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await AssignmentSubmission.find({
      user: req.user.id,
      course: req.params.courseId
    })
      .populate('assignment', 'title module topic dueDate totalPoints')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// Admin routes

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Admin)
export const createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Admin)
export const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Admin)
export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission
// @route   POST /api/assignments/submissions/:submissionId/grade
// @access  Private (Admin)
export const gradeSubmission = async (req, res, next) => {
  try {
    const { score, feedback, rubricScores } = req.body;

    const submission = await AssignmentSubmission.findById(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.rubricScores = rubricScores;
    submission.gradedBy = req.user.id;
    submission.gradedAt = Date.now();
    submission.status = 'graded';

    await submission.save();

    // Send notification to student
    await Notification.createNotification({
      user: submission.user,
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your assignment has been graded. Score: ${submission.finalScore}/${(await Assignment.findById(submission.assignment)).totalPoints}`,
      link: `/courses/${submission.course}/assignments/${submission.assignment}/submissions/${submission._id}`,
      relatedAssignment: submission.assignment,
      relatedCourse: submission.course
    });

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for an assignment (Admin)
// @route   GET /api/assignments/:id/submissions
// @access  Private (Admin)
export const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const query = { assignment: req.params.id };
    if (status) query.status = status;

    const submissions = await AssignmentSubmission.find(query)
      .populate('user', 'firstName lastName email')
      .populate('gradedBy', 'firstName lastName')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await AssignmentSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};
