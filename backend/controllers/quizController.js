import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import Notification from '../models/Notification.js';
import { getPagination } from '../utils/helpers.js';

// @desc    Get all quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getCourseQuizzes = async (req, res, next) => {
  try {
    const { moduleId, topicId } = req.query;

    const query = { course: req.params.courseId, isActive: true };
    if (moduleId) query['module.moduleId'] = moduleId;
    if (topicId) query['topic.topicId'] = topicId;

    const quizzes = await Quiz.find(query)
      .select('-questions.correctAnswer -questions.options.isCorrect')
      .sort({ 'module.moduleId': 1, createdAt: 1 });

    // Get user's attempts for each quiz
    const quizzesWithAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        const attempts = await QuizAttempt.find({
          user: req.user.id,
          quiz: quiz._id
        }).sort({ attemptNumber: -1 });

        return {
          ...quiz.toObject(),
          attempts: attempts.length,
          maxAttempts: quiz.maxAttempts,
          canAttempt: quiz.maxAttempts === 0 || attempts.length < quiz.maxAttempts,
          bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : null,
          lastAttempt: attempts[0] || null
        };
      })
    );

    res.status(200).json({
      success: true,
      count: quizzesWithAttempts.length,
      data: quizzesWithAttempts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer -questions.options.isCorrect');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: quiz.course
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access quizzes'
      });
    }

    // Get user's attempts
    const attempts = await QuizAttempt.find({
      user: req.user.id,
      quiz: quiz._id
    }).sort({ attemptNumber: -1 });

    const canAttempt = quiz.maxAttempts === 0 || attempts.length < quiz.maxAttempts;

    // Shuffle questions and options if enabled
    let questions = quiz.questions;
    if (quiz.shuffleQuestions) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }
    if (quiz.shuffleOptions) {
      questions = questions.map(q => ({
        ...q.toObject(),
        options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : []
      }));
    }

    res.status(200).json({
      success: true,
      data: {
        ...quiz.toObject(),
        questions,
        attempts: attempts.length,
        canAttempt,
        bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start quiz attempt
// @route   POST /api/quizzes/:id/start
// @access  Private
export const startQuizAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: quiz.course
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course'
      });
    }

    // Check attempts
    const attemptCount = await QuizAttempt.countDocuments({
      user: req.user.id,
      quiz: quiz._id
    });

    if (quiz.maxAttempts > 0 && attemptCount >= quiz.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: 'Maximum attempts reached'
      });
    }

    // Check if there's an active attempt
    const activeAttempt = await QuizAttempt.findOne({
      user: req.user.id,
      quiz: quiz._id,
      status: 'in-progress'
    });

    if (activeAttempt) {
      return res.status(400).json({
        success: false,
        message: 'You have an active attempt. Please complete or abandon it first',
        data: activeAttempt
      });
    }

    // Create new attempt
    const attempt = await QuizAttempt.create({
      user: req.user.id,
      quiz: quiz._id,
      course: quiz.course,
      attemptNumber: attemptCount + 1,
      totalPoints: quiz.totalPoints,
      startedAt: Date.now(),
      answers: []
    });

    res.status(201).json({
      success: true,
      message: 'Quiz attempt started',
      data: attempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answer
// @route   POST /api/quizzes/attempts/:attemptId/answer
// @access  Private
export const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOption, answer, timeTaken } = req.body;

    const attempt = await QuizAttempt.findById(req.params.attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    if (attempt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'This attempt is not active'
      });
    }

    // Get quiz and question
    const quiz = await Quiz.findById(attempt.quiz);
    const question = quiz.questions.id(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if already answered
    const existingAnswer = attempt.answers.find(
      a => a.questionId.toString() === questionId
    );

    if (existingAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Question already answered'
      });
    }

    // Evaluate answer
    let isCorrect = false;
    let pointsEarned = 0;

    if (question.type === 'multiple-choice') {
      const selectedOpt = question.options.id(selectedOption);
      isCorrect = selectedOpt && selectedOpt.isCorrect;
    } else if (question.type === 'true-false') {
      isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
    }

    if (isCorrect) {
      pointsEarned = question.points;
    }

    // Add answer
    attempt.answers.push({
      questionId,
      selectedOption,
      answer,
      isCorrect,
      pointsEarned,
      timeTaken
    });

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted',
      data: {
        questionId,
        isCorrect: quiz.showAnswers ? isCorrect : undefined,
        pointsEarned: quiz.showAnswers ? pointsEarned : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete quiz attempt
// @route   POST /api/quizzes/attempts/:attemptId/complete
// @access  Private
export const completeQuizAttempt = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    if (attempt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'This attempt is not active'
      });
    }

    // Calculate final score
    attempt.completedAt = Date.now();
    attempt.timeSpent = Math.floor((attempt.completedAt - attempt.startedAt) / 1000);
    attempt.status = 'completed';

    await attempt.save();

    // Get quiz details
    const quiz = await Quiz.findById(attempt.quiz);

    // Update progress if passed
    if (attempt.passed && quiz.topic && quiz.topic.topicId) {
      await Progress.findOneAndUpdate(
        {
          user: req.user.id,
          course: attempt.course,
          'topics.topicId': quiz.topic.topicId
        },
        {
          $set: {
            'topics.$.quizCompleted': true,
            'topics.$.quizScore': attempt.percentage
          }
        }
      );
    }

    // Send notification
    await Notification.createNotification({
      user: req.user.id,
      type: 'quiz',
      title: `Quiz ${attempt.passed ? 'Passed' : 'Completed'}`,
      message: `You scored ${attempt.percentage.toFixed(1)}% on "${quiz.title}"`,
      link: `/courses/${attempt.course}/quizzes/${quiz._id}/results/${attempt._id}`,
      relatedQuiz: quiz._id,
      relatedCourse: attempt.course
    });

    res.status(200).json({
      success: true,
      message: 'Quiz completed successfully',
      data: attempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz attempt results
// @route   GET /api/quizzes/attempts/:attemptId
// @access  Private
export const getAttemptResults = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quiz')
      .populate('course', 'title courseId');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    if (attempt.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get full quiz with answers if quiz allows showing answers
    const quiz = await Quiz.findById(attempt.quiz);
    
    let resultsData = attempt.toObject();
    
    if (quiz.showAnswers && attempt.status === 'completed') {
      resultsData.detailedResults = attempt.answers.map(answer => {
        const question = quiz.questions.id(answer.questionId);
        return {
          ...answer,
          question: question.question,
          type: question.type,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          options: question.options
        };
      });
    }

    res.status(200).json({
      success: true,
      data: resultsData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's quiz attempts for a course
// @route   GET /api/quizzes/course/:courseId/my-attempts
// @access  Private
export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({
      user: req.user.id,
      course: req.params.courseId
    })
      .populate('quiz', 'title module topic')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    next(error);
  }
};

// Admin routes

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private (Admin)
export const createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Admin)
export const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin)
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
