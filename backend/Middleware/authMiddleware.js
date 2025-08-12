const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
    return (req, res, next) => {
        try {
            // Get token from cookie or Authorization header
            const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
            // console.log("TOKEN : ", token)
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Role check
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = auth;