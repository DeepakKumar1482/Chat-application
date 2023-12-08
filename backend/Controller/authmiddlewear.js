const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Extract the token from the authorization header
        const token = req.headers['authorization'].split(" ")[1];
        const secretKey = 'yourSecretKeyHere';

        // Verify the token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    message: 'Authentication failed',
                    success: false
                });
            } else {
                // Attach the decoded user ID to the request object
                req.userId = decoded.id;
                next();
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};