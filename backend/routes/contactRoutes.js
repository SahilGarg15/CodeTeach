import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Public route
router.post('/send', sendContactMessage);

export default router;
