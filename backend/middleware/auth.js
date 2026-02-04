const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // 1. Get Token from Header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: No Token Provided' });
    }

    try {
        // 2. Verify Token
        const secret = process.env.JWT_SECRET || 'fallback_secret_only_for_dev_change_in_env';
        const decoded = jwt.verify(token, secret);

        // 3. Attach User to Request
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or Expired Token' });
    }
};
