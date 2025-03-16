const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Store user data in the request object
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid token', error: err.message });
  }
};

module.exports = authMiddleware;
