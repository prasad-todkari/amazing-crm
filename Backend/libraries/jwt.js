     const jwt = require('jsonwebtoken');
     require('dotenv').config();

     class JwtService {
         constructor() {
             this.secret = process.env.JWT_SECRET;
         }

         generateToken(payload) {
             return jwt.sign(payload, this.secret, { expiresIn: '1h' });
         }

         verifyToken(token) {
             return jwt.verify(token, this.secret);
         }
     }

     module.exports = new JwtService();
     