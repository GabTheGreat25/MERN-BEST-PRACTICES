const mongoose = require("mongoose");
const tryCatch = require("../utils/tryCatch");

const connectDB = tryCatch(async () => {
  // Connect to the MongoDB database using mongoose
  mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Log a success message if the connection is established successfully
  console.log(`MongoDB connected with HOST: ${mongoose.connection.host}`);
});

module.exports = connectDB;
