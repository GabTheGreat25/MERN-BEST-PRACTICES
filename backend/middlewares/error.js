const ErrorHandler = require("../utils/errorHandler");

/**
 * Error middleware that logs the error to the console and calls next with an instance of ErrorHandler.
 * If the error is already an instance of ErrorHandler, it is passed through.
 * If not, a new instance of ErrorHandler is created with a default status code of 500.
 * @example
 * In a controller:
 * const err = new Error("This is an error message");
 * err.statusCode = 400;
 * next(err);
 */
const errorJson = (err, req, res, next) => {
  console.error(err.stack);

  // If the error is already an instance of ErrorHandler, pass it through
  if (err instanceof ErrorHandler) return next(err);

  // Create a new instance of ErrorHandler
  const error = new ErrorHandler(err.message);

  // Call next with the error
  next(error);
};

/**
 * Error handling middleware that sends a JSON response with an error message and status code.
 * If the error is an instance of ErrorHandler, the status code is taken from the `statusCode` property.
 * Otherwise, a default status code of 500 is used.
 * @example
 *  In the errorJson middleware:
 * const error = new ErrorHandler("This is an error message", 400);
 * next(error);
 *
 * In the errorHandler middleware:
 * res.json({ success: false, error: { message: "This is an error message" }});
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
    },
  });
};

module.exports = { errorJson, errorHandler };
