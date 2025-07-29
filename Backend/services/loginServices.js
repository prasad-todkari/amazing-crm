const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secKey = process.env.JWT_SECRET;
const { crmPool } = require('../libraries/database');
const { logMessage } = require('../libraries/logger'); 


const loginQuery = async (data) => {
    const { username, password } = data;

    try {
        const log = await crmPool.query(
            "SELECT users_id, name, role, password_hash FROM users WHERE email = $1 AND password_hash IS NOT NULL",
            [username]
        );

        if (log.rowCount === 0) {
            logMessage(`Login failed: No such user ${username}`, 'ERROR');
            throw new Error('Invalid User');
        }

        const { users_id: userId, name, role, password_hash: hash } = log.rows[0];

        const isMatch = await bcrypt.compare(password, hash);

        if (!isMatch) {
            logMessage(`Login failed: Invalid password for ${username}`, 'ERROR');
            throw new Error('Invalid User');
        }

        const payload = { name, userId, role };
        const token = await new Promise((resolve, reject) => {
            jwt.sign({ data: payload }, secKey, { expiresIn: "7d" }, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
        logMessage(`${name} logged in successfully`, 'INFO');
        return { user: payload, auth: token };

    } catch (error) {
        logMessage(`Login error for ${username}: ${error.message}`, 'ERROR');
        throw error;
    }
};

module.exports = {
    loginQuery
};