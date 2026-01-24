const otpService = require('../services/otpService');
const db = require('../database');

exports.sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ error: 'Mobile number required' });

        // Check rate limits and log intent
        await otpService.logOtpRequest(mobile);

        // In Firebase Phone Auth, the "Send" action is initiated by the Client SDK.
        // We return success here to allow the client to proceed.
        res.json({ success: true, message: 'Ready for client-side OTP' });
    } catch (error) {
        console.error(error);
        res.status(429).json({ error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { mobile, otp: idToken } = req.body; // 'otp' field should contain the Firebase ID Token
        if (!mobile || !idToken) return res.status(400).json({ error: 'Mobile and Token required' });

        const verification = await otpService.verifyFirebaseToken(idToken, mobile);

        if (!verification.valid) {
            return res.status(400).json({ success: false, error: verification.reason });
        }

        // Check or create user
        let userRes = await db.query('SELECT * FROM users WHERE mobile = $1', [mobile]);
        let user;
        if (userRes.rows.length === 0) {
            const newUser = await db.query('INSERT INTO users (mobile) VALUES ($1) RETURNING *', [mobile]);
            user = newUser.rows[0];
        } else {
            user = userRes.rows[0];
        }

        res.json({ success: true, userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};
