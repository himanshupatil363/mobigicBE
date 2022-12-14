const { verify } = require("jsonwebtoken");
const User = require("../models/user.js");
const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(400).json({
        message: "Not authorized, token invalid",
      });
    }
  }
  if (!token) {
    res.status(401);
    return res.status(400).json({
      message: "Not authorized, no token",
    });
  }
};

module.exports = auth;