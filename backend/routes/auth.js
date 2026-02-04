const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/send-otp (Mostly for logging/rate-limiting, actual send is Firebase Client SDK)
router.post('/send-otp', authController.sendOtp);

// POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
