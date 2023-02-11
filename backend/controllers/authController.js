const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.registerUser = async (req, res, next) => {
  const requiredFields = ["name", "email", "password", "role"];

  // Check for missing fields
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length) {
    const errors = missingFields.map((field) => ({
      [field]: `${field} is required`,
    }));
    return res.status(400).json({ errors });
  }

  try {
    // Destructure the incoming data
    const { name, email, password, role } = req.body;
    // Hash the new password with a 12-round salt
    const saltRounds = 12;
    // Create a new user
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, saltRounds),
      role,
      avatar: {
        public_id: "avatars/johndoe",
        url: "https://res.cloudinary.com/dz9utsl7e/image/upload/v1676046468/johndoe_nes1cj.png",
      },
    });

    // Return success response
    return res.json({ success: true, user });
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    // Retrieve email and password from request body
    const { email, password } = req.body;

    // Find user in database based on email
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare entered password with hashed password in database
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    // Check if passwords match
    if (!isPasswordMatched) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If passwords match, send JWT token
    sendToken(user, 200, res);
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Clear the "token" cookie
    res.clearCookie("token");

    // Respond with a 200 status code and a success message
    return res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  // Search for the user with the specified email
  const user = await User.findOne({ email: req.body.email });

  // Return error if user is not found
  if (!user)
    return res.status(400).json({ error: "User not found with email" });

  // Generate password reset token for the user
  const resetToken = user.getResetPasswordToken(); // from models/user.js
  await user.save({ validateBeforeSave: false });

  // Compose the password reset URL and email message
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is: ${resetUrl}. If you didn't request this, please ignore it.`;

  try {
    // Send password reset email to the user
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    // Return success response if email was sent successfully
    return res.status(200).json({
      success: true,
      message: `An email with password reset instructions has been sent to ${user.email}.`,
    });
  } catch (error) {
    // Reset password token and expiration if email send fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // Return error response if email send fails
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
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
    if (!user) return res.status(400).json({ error: "Invalid token" });

    // Validate password
    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).json({ error: "Password mismatch" });

    // Hash the new password with a 12-round salt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Save new password, clear reset details
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token
    sendToken(user, 200, res);
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id);

    // Return success response with user data
    return res.status(200).json({ success: true, user });
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // Find the user and select only the password field
    const user = await User.findById(req.user.id).select("password");

    // Compare the entered old password with the stored password
    const isPasswordMatched = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    // If the old password is incorrect, return an error response
    if (!isPasswordMatched)
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });

    // Hash the new password with a 12-round salt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Update the password
    user.password = hashedPassword;

    // Save the changes to the database
    await user.save();

    // Send the token
    sendToken(user, 200, res);
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProfile = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }
    // Create an object with the new user data
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // Find the user by id and update the data
    const user = await User.findByIdAndUpdate({ _id: id }, newUserData, {
      new: true,
      runValidators: true,
    });

    // Return a success response
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.allUsers = async (req, res, next) => {
  try {
    // Find all products in the database and sort them by the `createdAt` field in descending order
    const users = await User.find().sort({ createdAt: -1 });

    // Return a success response with all the users
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    // Return a server error response if an error occurs
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getUserDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }
    // Find the user by ID
    const user = await User.findById({ _id: id });

    // If the user is not found, return a response with a failure message
    if (!user)
      return res.status(400).json({
        success: false,
        message: `User not found with ID: ${id}`,
      });

    // Return a success response with the user information
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // If an error occurs, return a server error response
    return res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    // Update user data with new information
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    // Find user by id and update the data
    const user = await User.findByIdAndUpdate({ _id: id }, newUserData, {
      new: true,
      runValidators: true,
    });

    // Return a success response
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // Handle any errors and return a server error response
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    // Find the user with the given ID and delete it
    const user = await User.findOneAndDelete({ _id: id });

    // If the user is not found, throw an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    // If an error occurs, pass it to the next middleware
    next(error);
  }
};

// Remove avatar from cloudinary

// const image_id = user.avatar.public_id;

// await cloudinary.v2.uploader.destroy(image_id);
