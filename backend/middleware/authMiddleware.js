const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_production_change_me');
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};
