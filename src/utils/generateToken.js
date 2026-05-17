// JWT token generator
const jwt = require('jsonwebtoken');

module.exports = function (user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};
