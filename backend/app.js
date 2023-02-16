const express = require("express");
const cookieParser = require("cookie-parser");
const { errorJson, errorHandler } = require("./middlewares/error");
const products = require("./routes/product");
const auth = require("./routes/auth");
const cors = require("cors");

const app = express();

// Allow cross-origin requests from any domain
app.use(cors());

// Middleware that parses incoming JSON requests
app.use(express.json());

// Middleware that parses cookies
app.use(cookieParser());

// Mount the product routes
app.use("/api/v1", products);

// Mount the auth routes
app.use("/api/v1", auth);

// Middleware that sends a JSON error response for unhandled errors
app.use(errorJson);

// Error handling middleware with `next`
app.use(errorHandler);

// Export the Express app instance
module.exports = app;

/*
 Example:
 
 const app = require('./app');
 const port = process.env.PORT || 3000;
 
 app.listen(port, () => {
   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
 });
*/
