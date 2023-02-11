const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  // Name of the user
  name: {
    // Define the data type as a string
    type: String,
    // Set the 'required' validator to ensure that a name is provided
    required: [true, "Please enter your name"],
    // Set the 'maxLength' validator to limit the name length to 30 characters
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },

  // Email of the user
  email: {
    // Define the data type as a string
    type: String,
    // Set the 'required' validator to ensure that an email is provided
    required: [true, "Please enter your email"],
    // Set the 'unique' validator to ensure that the email is unique across all users
    unique: true,
    // Set the 'validate' validator to check that the email is a valid email address
    validate: [validator.isEmail, "Please enter valid email address"],
  },

  // Password of the user
  password: {
    // Define the data type as a string
    type: String,
    // Set the 'required' validator to ensure that a password is provided
    required: [true, "Please enter your password"],
    // Set the 'minlength' validator to ensure that the password is at least 6 characters long
    minlength: [6, "Your password must be longer than 6 characters"],
    // Set the 'select' option to false to exclude the password from query results by default
    select: false,
  },

  // Avatar image of the user
  avatar: {
    // Public ID of the uploaded avatar image
    public_id: {
      // Define the data type as a string
      type: String,
      // Set the 'required' validator to ensure that a public ID is provided
      required: true,
    },
    // URL of the uploaded avatar image
    url: {
      // Define the data type as a string
      type: String,
      // Set the 'required' validator to ensure that a URL is provided
      required: true,
    },
  },

  // Role of the user (defaults to "user")
  role: {
    // Define the data type as a string
    type: String,
    // Set the default value to "user"
    default: "user",
  },

  // Timestamp of when the user was created
  createdAt: {
    // Define the data type as a date
    type: Date,
    // Set the default value to the current time
    default: Date.now,
  },

  // Token used to reset the user's password
  resetPasswordToken: String,

  // Expiration date of the password reset token
  resetPasswordExpire: Date,
});

// Create a method on the userSchema object
userSchema.methods.getJwtToken = function () {
  // Use the jwt library to sign a new JWT token
  // Pass in the user ID as the payload and the JWT secret from the environment variables as the secret
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    // Set the expiration time of the JWT token to the value specified in the environment variables
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token using the crypto module
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the resetToken using SHA256s
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the password reset expiration to 30 minutes from the current time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  // Return the resetToken
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
//Will be users in mongoose
