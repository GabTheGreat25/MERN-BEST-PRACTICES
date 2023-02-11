const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to the MongoDB database using mongoose
    mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log a success message if the connection is established successfully
    console.log(`MongoDB connected with HOST: ${mongoose.connection.host}`);
  } catch (error) {
    // Log an error message if the connection fails
    console.error(error);
  }
};

module.exports = connectDB;
