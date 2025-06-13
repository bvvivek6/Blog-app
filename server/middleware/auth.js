const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Expect token in Authorization header as: Bearer <token>
  const authHeader = req.header("Authorization");

  const token = authHeader?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
