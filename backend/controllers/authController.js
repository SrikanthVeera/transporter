const otpService = require('../services/otpService');
const db = require('../database/db');
const jwt = require('jsonwebtoken');

exports.sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ error: 'Mobile number required' });

        // Check rate limits and log intent (optional, implementation depends on otpService)
        // In Firebase Client flow, ensuring mobile validity is enough here.

        res.json({ success: true, message: 'Ready for client-side OTP' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ error: 'Missing fields' });

    try {
        // 1. Verify Firebase ID Token
        const verification = await otpService.verifyFirebaseToken(otp, mobile);

        if (!verification.valid) {
            return res.status(401).json({ error: verification.reason || 'Invalid OTP Token' });
        }

        // 3. Login/Register User (MySQL)
        // Use Insert Ignore to skip if exists
        await db.query(`INSERT IGNORE INTO users (mobile) VALUES (?)`, [mobile]);

        // Fetch the user details
        const [users] = await db.query('SELECT id, mobile FROM users WHERE mobile = ?', [mobile]);
        const user = users[0];

        if (!user) {
            throw new Error('User creation failed');
        }

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
};
