const express = require("express");
const router = express.Router();

// Import controllers and middlewares
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Route for registering a new user
router.route("/register").post(registerUser);

// Route for logging in a user
router.route("/login").post(loginUser);

// Route for logging out a user
router.route("/logout").get(logout);

// Route for handling password reset request
router.route("/password/forgot").post(forgotPassword);

// Route for resetting password
router.route("/password/reset/:token").put(resetPassword);

// Route for getting user profile
router.route("/me").get(isAuthenticatedUser, getUserProfile);

// Route for updating user password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// Route for updating user profile
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// Route for viewing all users for admin
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

// Routes for managing individual users by admin
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
