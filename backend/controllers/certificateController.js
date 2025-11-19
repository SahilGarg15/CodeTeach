import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import QuizAttempt from '../models/QuizAttempt.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Notification from '../models/Notification.js';
import { getPagination } from '../utils/helpers.js';

// @desc    Get user's certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
export const getMyCertificates = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const certificates = await Certificate.find({
      user: req.user.id,
      isRevoked: false
    })
      .populate('course', 'title courseId thumbnail')
      .sort({ issuedDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Certificate.countDocuments({
      user: req.user.id,
      isRevoked: false
    });

    res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Public
export const getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title courseId description instructor');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (certificate.isRevoked) {
      return res.status(400).json({
        success: false,
        message: 'This certificate has been revoked',
        reason: certificate.revokedReason
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate by certificate ID (public verification)
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId
    })
      .populate('user', 'firstName lastName')
      .populate('course', 'title courseId');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
        isValid: false
      });
    }

    if (certificate.isRevoked) {
      return res.status(200).json({
        success: false,
        message: 'This certificate has been revoked',
        isValid: false,
        data: {
          certificateId: certificate.certificateId,
          revokedReason: certificate.revokedReason,
          revokedAt: certificate.revokedAt
        }
      });
    }

    // Check expiry
    if (certificate.expiryDate && new Date() > new Date(certificate.expiryDate)) {
      return res.status(200).json({
        success: false,
        message: 'This certificate has expired',
        isValid: false,
        data: {
          certificateId: certificate.certificateId,
          expiryDate: certificate.expiryDate
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate is valid',
      isValid: true,
      data: {
        certificateId: certificate.certificateId,
        holderName: `${certificate.user.firstName} ${certificate.user.lastName}`,
        courseName: certificate.course.title,
        issuedDate: certificate.issuedDate,
        grade: certificate.grade,
        isVerified: certificate.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request certificate for completed course
// @route   POST /api/certificates/request/:courseId
// @access  Private
export const requestCertificate = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    // Check if already has certificate
    const existingCertificate = await Certificate.findOne({
      user: req.user.id,
      course: courseId,
      isRevoked: false
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already issued for this course',
        data: existingCertificate
      });
    }

    // Check enrollment and completion
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    if (!enrollment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'You must complete the course before requesting a certificate',
        currentProgress: enrollment.progress
      });
    }

    // Get course details
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Calculate statistics
    const quizAttempts = await QuizAttempt.find({
      user: req.user.id,
      course: courseId,
      status: 'completed'
    });

    const assignments = await AssignmentSubmission.find({
      user: req.user.id,
      course: courseId,
      status: 'graded'
    });

    const averageQuizScore = quizAttempts.length > 0
      ? quizAttempts.reduce((sum, a) => sum + a.percentage, 0) / quizAttempts.length
      : 0;

    const averageAssignmentScore = assignments.length > 0
      ? assignments.reduce((sum, a) => sum + (a.finalScore || 0), 0) / assignments.length
      : 0;

    // Calculate final score (weighted average)
    const finalScore = (averageQuizScore * 0.4 + averageAssignmentScore * 0.6);

    // Get progress for total hours
    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId
    });

    // Create certificate
    const certificate = await Certificate.create({
      user: req.user.id,
      course: courseId,
      completionDate: enrollment.completedAt || Date.now(),
      finalScore: Math.round(finalScore),
      credentialUrl: null, // Will be generated
      metadata: {
        totalModules: course.modules.length,
        completedModules: progress?.topics?.filter(t => t.completed).length || 0,
        totalQuizzes: quizAttempts.length,
        averageQuizScore: Math.round(averageQuizScore),
        totalAssignments: assignments.length,
        averageAssignmentScore: Math.round(averageAssignmentScore),
        totalHours: Math.round((progress?.totalTimeSpent || 0) / 3600)
      }
    });

    await certificate.populate('course', 'title courseId');

    // Send notification
    await Notification.createNotification({
      user: req.user.id,
      type: 'certificate',
      title: 'Certificate Issued',
      message: `Congratulations! Your certificate for "${course.title}" is ready`,
      link: `/certificates/${certificate._id}`,
      relatedCourse: courseId
    });

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download certificate PDF
// @route   GET /api/certificates/:id/download
// @access  Private
export const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title instructor');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check authorization
    if (certificate.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this certificate'
      });
    }

    if (certificate.isRevoked) {
      return res.status(400).json({
        success: false,
        message: 'This certificate has been revoked'
      });
    }

    // TODO: Generate PDF using a library like puppeteer or pdfkit
    // For now, return certificate data
    res.status(200).json({
      success: true,
      message: 'Certificate ready for download',
      data: certificate,
      downloadUrl: certificate.pdfUrl || null
    });
  } catch (error) {
    next(error);
  }
};

// Admin routes

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Private (Admin)
export const getAllCertificates = async (req, res, next) => {
  try {
    const { page, limit, courseId, userId, isRevoked } = req.query;
    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    const query = {};
    if (courseId) query.course = courseId;
    if (userId) query.user = userId;
    if (isRevoked !== undefined) query.isRevoked = isRevoked === 'true';

    const certificates = await Certificate.find(query)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title courseId')
      .sort({ issuedDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Certificate.countDocuments(query);

    res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke certificate
// @route   POST /api/certificates/:id/revoke
// @access  Private (Admin)
export const revokeCertificate = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (certificate.isRevoked) {
      return res.status(400).json({
        success: false,
        message: 'Certificate is already revoked'
      });
    }

    certificate.isRevoked = true;
    certificate.revokedReason = reason;
    certificate.revokedAt = Date.now();

    await certificate.save();

    // Notify user
    await Notification.createNotification({
      user: certificate.user,
      type: 'system',
      title: 'Certificate Revoked',
      message: `Your certificate for course has been revoked. Reason: ${reason}`,
      priority: 'high',
      relatedCourse: certificate.course
    });

    res.status(200).json({
      success: true,
      message: 'Certificate revoked successfully',
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Issue certificate manually (Admin)
// @route   POST /api/certificates/issue
// @access  Private (Admin)
export const issueCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.create(req.body);

    await certificate.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'course', select: 'title courseId' }
    ]);

    // Notify user
    await Notification.createNotification({
      user: certificate.user._id,
      type: 'certificate',
      title: 'Certificate Issued',
      message: `You have been awarded a certificate for "${certificate.course.title}"`,
      link: `/certificates/${certificate._id}`,
      relatedCourse: certificate.course._id
    });

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};
