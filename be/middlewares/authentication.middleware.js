const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(createError.Unauthorized("F16"));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err) {
        req.user = decoded;
        return next();
      }
      return next(createError.Unauthorized("B14"));
    });
  } catch (err) {
    return next(createError.InternalServerError(err.message));
  }
};

module.exports = authenticateUser;