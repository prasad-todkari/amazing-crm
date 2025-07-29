const { loginQuery } = require('../services/loginServices');

const loginController = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const data = { username, password };

    try {
        const result = await loginQuery(data);
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: result.auth,
            user: result.user  // optional
        });
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: error.message || 'Login failed'
        });
    }
};

module.exports = {
    loginController
};