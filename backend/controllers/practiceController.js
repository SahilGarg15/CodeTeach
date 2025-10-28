import PracticeSubmission from '../models/PracticeSubmission.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// @desc    Submit practice solution
// @route   POST /api/practice/submit
// @access  Private
export const submitPractice = async (req, res, next) => {
  try {
    const {
      courseId,
      practiceSetId,
      questionId,
      userCode,
      language,
      status,
      score,
      testsPassed,
      totalTests,
      executionTime,
      memoryUsed,
      feedback
    } = req.body;

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

    // Create submission
    const submission = await PracticeSubmission.create({
      user: req.user.id,
      course: courseId,
      practiceSetId,
      questionId,
      userCode,
      language: language || 'java',
      status,
      score: score || 0,
      testsPassed: testsPassed || 0,
      totalTests: totalTests || 0,
      executionTime,
      memoryUsed,
      feedback: feedback || ''
    });

    res.status(201).json({
      success: true,
      message: 'Practice solution submitted successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's practice submissions for a course
// @route   GET /api/practice/course/:courseId
// @access  Private
export const getCourseSubmissions = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { practiceSetId, status } = req.query;

    const query = {
      user: req.user.id,
      course: courseId
    };

    if (practiceSetId) {
      query.practiceSetId = practiceSetId;
    }

    if (status) {
      query.status = status;
    }

    const submissions = await PracticeSubmission.find(query)
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

// @desc    Get submission by ID
// @route   GET /api/practice/:submissionId
// @access  Private
export const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await PracticeSubmission.findOne({
      _id: req.params.submissionId,
      user: req.user.id
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
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

// @desc    Get practice statistics for a course
// @route   GET /api/practice/stats/:courseId
// @access  Private
export const getPracticeStats = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const submissions = await PracticeSubmission.find({
      user: req.user.id,
      course: courseId
    });

    const stats = {
      totalSubmissions: submissions.length,
      correctSubmissions: submissions.filter(s => s.status === 'correct').length,
      incorrectSubmissions: submissions.filter(s => s.status === 'incorrect').length,
      partialSubmissions: submissions.filter(s => s.status === 'partial').length,
      averageScore: submissions.length > 0
        ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)
        : 0,
      totalTestsPassed: submissions.reduce((sum, s) => sum + s.testsPassed, 0),
      totalTests: submissions.reduce((sum, s) => sum + s.totalTests, 0),
      practiceSets: {}
    };

    // Group by practice set
    submissions.forEach(submission => {
      if (!stats.practiceSets[submission.practiceSetId]) {
        stats.practiceSets[submission.practiceSetId] = {
          total: 0,
          correct: 0,
          incorrect: 0,
          partial: 0,
          questions: {}
        };
      }

      stats.practiceSets[submission.practiceSetId].total++;
      stats.practiceSets[submission.practiceSetId][submission.status]++;

      // Track best submission for each question
      if (!stats.practiceSets[submission.practiceSetId].questions[submission.questionId]) {
        stats.practiceSets[submission.practiceSetId].questions[submission.questionId] = {
          bestScore: submission.score,
          status: submission.status,
          attempts: 1
        };
      } else {
        const question = stats.practiceSets[submission.practiceSetId].questions[submission.questionId];
        question.attempts++;
        if (submission.score > question.bestScore) {
          question.bestScore = submission.score;
          question.status = submission.status;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest submission for a question
// @route   GET /api/practice/latest/:courseId/:practiceSetId/:questionId
// @access  Private
export const getLatestSubmission = async (req, res, next) => {
  try {
    const { courseId, practiceSetId, questionId } = req.params;

    const submission = await PracticeSubmission.findOne({
      user: req.user.id,
      course: courseId,
      practiceSetId,
      questionId
    }).sort({ submittedAt: -1 });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'No submission found'
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

// @desc    Get all submissions for a specific question
// @route   GET /api/practice/history/:courseId/:practiceSetId/:questionId
// @access  Private
export const getQuestionSubmissionHistory = async (req, res, next) => {
  try {
    const { courseId, practiceSetId, questionId } = req.params;

    const submissions = await PracticeSubmission.find({
      user: req.user.id,
      course: courseId,
      practiceSetId,
      questionId
    }).sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete practice submission
// @route   DELETE /api/practice/:submissionId
// @access  Private
export const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await PracticeSubmission.findOne({
      _id: req.params.submissionId,
      user: req.user.id
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get practice leaderboard for a course
// @route   GET /api/practice/leaderboard/:courseId
// @access  Private
export const getPracticeLeaderboard = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { practiceSetId, limit = 10 } = req.query;

    const matchStage = { course: courseId };
    if (practiceSetId) {
      matchStage.practiceSetId = practiceSetId;
    }

    const leaderboard = await PracticeSubmission.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$user',
          totalSubmissions: { $sum: 1 },
          correctSubmissions: {
            $sum: { $cond: [{ $eq: ['$status', 'correct'] }, 1, 0] }
          },
          averageScore: { $avg: '$score' },
          totalTestsPassed: { $sum: '$testsPassed' }
        }
      },
      { $sort: { correctSubmissions: -1, averageScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          userId: '$_id',
          firstName: '$userInfo.firstName',
          lastName: '$userInfo.lastName',
          avatar: '$userInfo.avatar',
          totalSubmissions: 1,
          correctSubmissions: 1,
          averageScore: { $round: ['$averageScore', 2] },
          totalTestsPassed: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};
