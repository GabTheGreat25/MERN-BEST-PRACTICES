const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// Use the express.json middleware to parse JSON requests
app.use(express.json());

// Use the cookieParser middleware to handle cookies
app.use(cookieParser());

// Import and use the product routes
const products = require("./routes/product");
app.use("/api/v1", products);

// Import and use the auth routes
const auth = require("./routes/auth");
app.use("/api/v1", auth);

// Export the Express app instance
module.exports = app;
