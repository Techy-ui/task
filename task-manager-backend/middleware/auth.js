const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Look for the token in the Authorization header
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token using your JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_key');
        
        // CRUCIAL: Make sure this sets req.userId so taskRoutes can read it!
        req.userId = decoded.userId || decoded.id; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};