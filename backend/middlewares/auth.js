// Requiring necessary modules
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

/*
isAuthenticatedUser: This function is used to verify if the user who is trying to access the resource
 is authenticated. The authentication is based on the presence of a JWT token in the cookies of the request. 
 If the token is not present in the cookies, the function returns a JSON response with a message
  indicating that the user must log in first to access the resource.

authorizeRoles: This function is used to verify if the user who is trying to access the resource is authorized.
 The authorization is based on the user's role, and a list of allowed roles is provided as an argument 
 to the function. If the user's role is not in the list of allowed roles, the function returns a JSON response
 with a message indicating that the user's role is not allowed to access the resource.
*/

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
  /**
   * The isAuthenticatedUser middleware function is used to verify if the user who is trying to access the resource is authenticated.
   * It looks for a JSON Web Token (JWT) in the cookies property of the request object.
   * If the token is not present, it returns a JSON response with a message indicating that the user must log in first to access the resource.
   * If the token is present, it decodes the token using the jsonwebtoken module and retrieves the user ID from the decoded token.
   * It then finds the user document in the database using the user ID and sets the user property on the request object to the retrieved user document.
   * Finally, it calls the next function to pass control to the next middleware function.
   */
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Access denied. Please log in first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Your session has expired. Please log in again.",
    });
  }
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
    if (!roles.includes(req.user.role))
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`
        )
      );
    next();
  };
};

/**
* The authorizeRoles function is an Express middleware that checks if the authenticated user
* has the necessary role(s) to access a particular resource. It takes one or more roles as arguments
* and returns a function that takes in the req, res, and next arguments.

* When the middleware function is executed, it first checks if the authenticated user's role
* is included in the list of roles passed as arguments. If the user's role is not included,
* it returns a 400 status response with a JSON payload containing an error message
* indicating that the user's role is not authorized to access the resource.

* If the user's role is included, the middleware function calls the next() function, 
* which passes control to the next middleware function or route handler in the chain.

* For example, if a user with a role of "admin" is trying to access a resource that is only allowed
* for "superadmin" and "moderator" roles, this middleware function will deny access and return an error message.
*/
