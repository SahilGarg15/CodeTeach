import { sendContactEmail } from '../config/email.js';

// @desc    Send contact form message
// @route   POST /api/contact/send
// @access  Public
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send email notification to admin
    await sendContactEmail({
      name,
      email,
      subject,
      message
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    next(error);
  }
};
