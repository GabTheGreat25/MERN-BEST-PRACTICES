// Define a function called SuccessHandler that takes in the response object, message, and info as parameters
const SuccessHandler = (res, message, info) => {
  // If info is not null, return a JSON response with success status, message, and info
  if (info != null) {
    res.status(200).json({
      success: true,
      message: message,
      info: info,
    });
  }
  // If info is null, return a JSON response with success status and message only
  else {
    res.status(200).json({
      success: true,
      message: message,
    });
  }
};

// Export the SuccessHandler function so it can be used in other modules
module.exports = SuccessHandler;
