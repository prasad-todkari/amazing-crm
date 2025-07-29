const JWT_KEY = process.env.JWT_SECRET; 
require('dotenv').config();
const jwt = require('jsonwebtoken'); // Ensure you have this import

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid Token..!!' });
        }
        if (!JWT_KEY) {
            return res.status(500).json({ message: 'Server configuration error: JWT_KEY is not set.' });
        }        
        const user = jwt.verify(token, JWT_KEY);        
        req.user = user; 
        next();
    } catch (error) {
        console.error("JWT verification error:", error); 
        console.error("Error details:", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid Token..!!' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired..!!' });
        }
        return res.status(401).json({ message: 'Unauthorised User' });
    }
};


module.exports = authMiddleware;
