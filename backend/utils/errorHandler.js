/**
 * ErrorHandler is a custom error class that extends the built-in Error class in JavaScript.
 * It allows us to handle errors more effectively by adding additional properties and methods to the error object.
 *
 * @class ErrorHandler
 *
 * @extends Error
 *
 * @property {number} statusCode - The HTTP status code that should be sent in the response for this error.
 *
 * @example
 * throw new ErrorHandler('Something went wrong', 500);
 */
class ErrorHandler extends Error {
  /**
   * Creates an instance of ErrorHandler.
   *
   * @param {string} message - A description of the error.
   * @param {number} statusCode - The HTTP status code that should be sent in the response for this error.
   *
   * @memberof ErrorHandler
   */
  constructor(message, statusCode) {
    // Call the parent constructor to initialize the error message.
    super(message);

    // Set the statusCode property to the value passed in to the constructor.
    this.statusCode = statusCode;

    // Capture a stack trace for this error, excluding the constructor call.
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the ErrorHandler class for use in other modules.
module.exports = ErrorHandler;
