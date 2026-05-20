const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Check cookie OR Authorization header (Bearer token)
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }
  
  const secret = process.env.JWT_SECRET || "fallback_secret_key_for_assignment";
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired." });
    }
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
