const { verifyToken } = require('../helpers/gerate-token');

const checkAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ').pop();
        const tokenData = verifyToken(token);

        if (tokenData._id) {
            next();
        } else {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkAuth;