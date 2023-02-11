const app = require("./app");
const connectDatabase = require("./config/database");
const path = require("path");

// Import and configure the environment variables using dotenv
require("dotenv").config({ path: "./config/.env" });

// Connect to the database
connectDatabase();

// Log the value of the DATABASE environment variable
console.log(process.env.DATABASE);

// Start the Express app on the specified port
app.listen(process.env.PORT, () => {
  // Log that the server has started and on which port
  console.log(
    `Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
