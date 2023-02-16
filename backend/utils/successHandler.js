const SuccessHandler = (res, message, data) => {
  res.status(200).json({
    success: true,
    message: message,
    data: data.data,
  });
};

module.exports = SuccessHandler;
