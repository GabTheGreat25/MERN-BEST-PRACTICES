const successHandler = (res, message, data) => {
  return res.status(200).json({
    success: true,
    message: message,
    data: data,
  });
};

module.exports = successHandler;
