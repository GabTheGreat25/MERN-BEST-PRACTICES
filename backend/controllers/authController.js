const User = require("../models/user");
const Session = require("../models/session");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const tryCatch = require("../utils/tryCatch");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.registerUser = tryCatch(async (req, res, next) => {
  const requiredFields = ["name", "email", "password", "role"];

  // Check for missing fields
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length) {
    const errorMessage = missingFields.join(", ") + " is required";
    const error = new ErrorHandler(errorMessage);
    return next(error);
  }
  // Destructure the incoming data
  const { name, email, password, role } = req.body;

  // Create a new user
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, Number(process.env.SALT_NUMBER)),
    role,
    avatar: {
      public_id: "avatars/johndoe",
      url: "https://res.cloudinary.com/dz9utsl7e/image/upload/v1676046468/johndoe_nes1cj.png",
    },
  });

  // Return success response
  SuccessHandler(res, user);
});

exports.loginUser = tryCatch(async (req, res, next) => {
  // Retrieve email and password from request body
  const { email, password } = req.body;

  // Find user in database based on email
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists
  if (!user) return next(new ErrorHandler("User not found"));

  // Compare entered password with hashed password in database
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  // Check if passwords match
  if (!isPasswordMatched) return next(new ErrorHandler("Invalid credentials"));

  // Check if the user already has an active session
  const existingSession = await Session.findOne({
    user: user._id,
    isActive: true,
  });

  // If the user has an active session, reject the login attempt
  if (existingSession)
    return next(new ErrorHandler("User already has an active session"));

  // Delete all old sessions for the user and create a new session
  await Session.deleteMany({ user: user._id });
  await Session.create({ user: user._id });

  // Send JWT token
  sendToken(user, 200, res);
});

exports.logout = tryCatch(async (req, res, next) => {
  // Get the user's session
  const session = await Session.findOne({
    user: req.user._id,
    isActive: true,
  });

  // Deactivate the session
  session.isActive = false;
  await session.save();

  // Clear the "token" cookie
  res.clearCookie("token");

  // Respond a success message
  SuccessHandler(res, "Logged out");
});

exports.forgotPassword = tryCatch(async (req, res, next) => {
  // Search for the user with the specified email
  const user = await User.findOne({ email: req.body.email });

  // Return error if user is not found
  if (!user) return next(new ErrorHandler("User nor found with email"));

  // Generate password reset token for the user
  const resetToken = user.getResetPasswordToken(); // from models/user.js
  await user.save({ validateBeforeSave: false });

  // Compose the password reset URL and email message
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetToken}`;
  const resetUrl = `password/reset/${resetToken}`;
  const message = `Your password reset token is: ${resetUrl}. If you didn't request this, please ignore it.`;

  // Send password reset email to the user
  await sendEmail({
    email: user.email,
    subject: "ShopIT Password Recovery",
    message,
  });

  // Return success response if email was sent successfully
  SuccessHandler(
    res,
    `An email with password reset instructions has been sent to ${user.email}.`
  );
});

exports.resetPassword = tryCatch(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user with matching token and not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // Check if user exists
  if (!user) return next(new ErrorHandler("Invalid Token"));

  // Validate password
  if (req.body.password !== req.body.confirmPassword)
    return next(new ErrorHandler("Password Mismatch"));

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(process.env.SALT_NUMBER)
  );

  // Save new password, clear reset details
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send token
  sendToken(user, 200, res);
});

exports.getUserProfile = tryCatch(async (req, res, next) => {
  // Find user by ID
  const user = await User.findById(req.user.id);

  // Return success response with user data
  SuccessHandler(res, user);
});

exports.updatePassword = tryCatch(async (req, res, next) => {
  // Find the user and select only the password field
  const user = await User.findById(req.user.id).select("password");

  // Compare the entered old password with the stored password
  const isPasswordMatched = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  // If the old password is incorrect, return an error response
  if (!isPasswordMatched)
    return next(new ErrorHandler("Old password is incorrect"));

  // Hash the new password with a 12-round salt
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  // Update the password
  user.password = hashedPassword;

  // Save the changes to the database
  await user.save();

  // Send the token
  sendToken(user, 200, res);
});

exports.updateProfile = tryCatch(async (req, res, next) => {
  // Get the user's id from the session
  const id = req.user._id;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid User ID"));

  // Create an object with the new user data
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Find the user by id and update the data
  const user = await User.findByIdAndUpdate(id, newUserData, {
    new: true,
    runValidators: true,
  });

  // Return a success response
  SuccessHandler(res, user);
});

exports.allUsers = tryCatch(async (req, res, next) => {
  // Find all products in the database and sort them by the `createdAt` field in descending order
  const users = await User.find().sort({ createdAt: -1 });

  // Return a success response with all the users
  SuccessHandler(res, users);
});

exports.getUserDetails = tryCatch(async (req, res, next) => {
  // Get the user's id from the request params
  const id = req.params.id;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`User not found with ID: ${id}`));

  const user = await User.findById(id);

  SuccessHandler(res, user);
});

exports.updateUser = tryCatch(async (req, res, next) => {
  // Get the user's id from the session
  const id = req.user._id;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid User ID"));

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(id, newUserData, {
    new: true,
    runValidators: true,
  });

  SuccessHandler(res, user);
});

exports.deleteUser = tryCatch(async (req, res, next) => {
  // Get the user's id from the request params
  const id = req.params.id;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`User not found with ID: ${id}`));

  // Find and delete the user
  const user = await User.findOneAndDelete({ _id: id });

  // Delete all past sessions of the user
  await Session.deleteMany({ userId: id });

  SuccessHandler(res, "User and their past sessions deleted");
});

// Remove avatar from cloudinary

// const image_id = user.avatar.public_id;

// await cloudinary.v2.uploader.destroy(image_id);
