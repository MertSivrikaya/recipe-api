const jwt = require('jsonwebtoken');

const login = (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Hardcoded admin credentials for demonstration purposes as we don't have a user database.
        if (username === 'admin' && password === 'password123') {
            // Create the payload
            const payload = { role: 'admin' };
            
            // Sign the token with your secret key (expires in 1 hour)
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            // Return the token to the client
            return res.status(200).json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { login };