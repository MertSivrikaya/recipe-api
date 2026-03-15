// As we need a stateless RESTFUL API, we will use JSON Web Tokens (JWT) for authentication.
// JWT allows us to securely transmit information between parties as a JSON object. 
// It is compact, self-contained, and can be easily verified and trusted because it is digitally signed.
 
// This middleware will be used to protect certain routes that require authentication/authorization.
// It will check for the presence of a JWT in the Authorization header of incoming requests,
// verify the token, and allow access to the route if the token is valid.

// This middleware will attach the decoded user information to the request object (e.g., req.user)
// so that downstream route handlers can access it for authorization checks or personalized responses.

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Tokens are usually sent in the Authorization header as "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // The request lacks the valid authentication credentials (i.e., no token was provided).
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded payload to the request object so the controller can use it
        req.user = decoded; 
        
        // Pass control to the next middleware or controller
        next();
    } catch (err) {
        // The server understood the request but refuses to authorize it.
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;