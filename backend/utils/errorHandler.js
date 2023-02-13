/**
 * Custom error class that extends the built-in Error class.
 * @class
 * @classdesc Provides a way to create custom error objects with customizable HTTP status codes.
 * @param {string} message - The error message to be displayed.
 * @param {number} [statusCode=400] - The HTTP status code to be sent to the client.
 * @returns {ErrorHandler} An instance of the ErrorHandler class.
 *
 * @example
 * Create a new ErrorHandler instance with a custom message and status code.
 * const err = new ErrorHandler('This is a custom error message', 404);
 *
 * @example
 * Create a new ErrorHandler instance with a default status code of 400.
 * const err = new ErrorHandler('This is a custom error message');
 */
class ErrorHandler extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Customizes the error response sent to the client by returning a JSON object with a `success`
   * property set to `false`, and an `error` property with the error message.
   * @returns {object} A JSON object representing the error response to be sent to the client.
   *
   * @example
   * Convert an ErrorHandler instance to a JSON object.
   * const err = new ErrorHandler('This is a custom error message', 404);
   * const errJson = err.toJSON(); // { success: false, error: { message: 'This is a custom error message' } }
   */
  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
      },
    };
  }
}

module.exports = ErrorHandler;
