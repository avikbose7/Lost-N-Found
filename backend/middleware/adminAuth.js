const auth = require('./auth');

// This middleware checks for a valid token, *and* checks if the user is an admin.
module.exports = function(req, res, next) {
  // First, run the standard 'auth' middleware
  auth(req, res, () => {
    // If authenticated, check the user's role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden: Admin access required' });
    }
    // If user is authenticated AND is an admin, proceed
    next();
  });
};