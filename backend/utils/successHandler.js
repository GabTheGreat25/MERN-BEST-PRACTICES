const successHandler = (res, message) => {
  return res.status(200).json({
    success: true,
    message: message,
  });
};

module.exports = successHandler;
