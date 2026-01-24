const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../database/db');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService');

// POST /api/auth/send-otp



// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ error: 'Missing fields' });

    try {
        // 1. Verify Firebase ID Token
        const verification = await otpService.verifyFirebaseToken(otp, mobile);

        if (!verification.valid) {
            return res.status(401).json({ error: verification.reason || 'Invalid OTP Token' });
        }

        // 3. Login/Register User
        await db.query(`INSERT IGNORE INTO users (mobile) VALUES (?)`, [mobile]);
        const [users] = await db.query('SELECT id, mobile FROM users WHERE mobile = ?', [mobile]);
        const user = users[0];

        // 4. Generate JWT
        const secret = process.env.JWT_SECRET || 'fallback_secret_only_for_dev_change_in_env';
        const token = jwt.sign(
            { id: user.id, mobile: user.mobile },
            secret,
            { expiresIn: '7d' }
        );

        // 5. Return Success with Token
        res.json({
            success: true,
            message: 'OTP verified',
            token: token,
            user: { id: user.id, mobile: user.mobile }
        });

    } catch (err) {
        console.error('Verify OTP Error:', err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

module.exports = router;
