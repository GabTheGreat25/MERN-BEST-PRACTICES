// Requiring necessary modules
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

/**
 * Verify if the user is authenticated
 *
 * This function is used to verify if the user who is trying to access the resource is authenticated.
 * The authentication is based on the presence of a JWT token in the cookies of the request.
 * If the token is not present in the cookies, the function returns a JSON response with a
 * message indicating that the user must log in first to access the resource.
 *
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} if token is not present in cookies
 */
exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Login first to access this resource",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
};

/**
 * Verify if the user is authorized to access the resource
 *
 * This function is used to verify if the user who is trying to access the resource is authorized.
 * The authorization is based on the user's role, and a list of allowed roles is provided as an argument to the function.
 * If the user's role is not in the list of allowed roles, the function returns a JSON response with a
 * message indicating that the user's role is not allowed to access the resource.
 *
 * @function
 * @param {Array} roles - Allowed roles
 * @returns {Function} Express middleware function
 * @throws {Error} if user's role is not in the list of allowed roles
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to acccess this resource`,
      });
    }

    next();
  };
};
