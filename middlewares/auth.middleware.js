const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const HttpError = require("../models/error");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get Token
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new HttpError("Not authorized");
    }

    if (!token) {
      res.status(401);
      throw new HttpError("Not authorized");
    }
  }
};

module.exports = { protect };