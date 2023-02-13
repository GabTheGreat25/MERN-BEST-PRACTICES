const app = require("./app");
const connectDatabase = require("./config/database");
const path = require("path");

// Import and configure the environment variables using dotenv
require("dotenv").config({ path: "./config/.env" });

// Connect to the MongoDB database
connectDatabase();

// Log the value of the DATABASE environment variable
console.log(`DATABASE: ${process.env.DATABASE}`);

// Start the Express app on the specified port
app.listen(process.env.PORT, () => {
  // Log that the server has started and on which port
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

/**
 * This file is responsible for starting the Express app and connecting to the database.
 * The dotenv library is used to configure the environment variables, which are loaded from the .env file.
 * The connectDatabase function is called to establish a connection with the MongoDB database.
 * The value of the DATABASE environment variable is logged to the console.
 * The app is started by calling the listen method on the app object with the PORT environment variable.
 * A callback function logs that the server has started and on which port.
 * Example:
 *  If the PORT environment variable is set to 3000 and the NODE_ENV environment variable is set to "development",
 *  the console output will be:
 *    DATABASE: mongodb://localhost:27017/mydatabase
 *    Server started on port 3000 in development mode.
 */
