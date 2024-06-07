const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '24112000@Kk'; // Make sure to use a secure secret in production

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
