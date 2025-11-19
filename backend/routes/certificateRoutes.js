import express from 'express';
import {
  getMyCertificates,
  getCertificate,
  verifyCertificate,
  requestCertificate,
  downloadCertificate,
  getAllCertificates,
  revokeCertificate,
  issueCertificate
} from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/verify/:certificateId', verifyCertificate);
router.get('/:id', getCertificate);

// Protected routes
router.use(protect);

router.get('/', authorize('admin'), getAllCertificates);
router.get('/my-certificates', getMyCertificates);
router.post('/request/:courseId', requestCertificate);
router.get('/:id/download', downloadCertificate);

// Admin routes
router.post('/issue', authorize('admin'), issueCertificate);
router.post('/:id/revoke', authorize('admin'), revokeCertificate);

export default router;
