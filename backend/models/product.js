const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // The name of the product
  name: {
    type: String,
    // This field is required, and a custom error message is provided
    required: [true, "Please enter product name"],
    // The 'trim' option is set to 'true', so any whitespace before or after the string will be removed
    trim: true,
    // The max length of the product name is set to 100 characters, with a custom error message
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },

  // The price of the product
  price: {
    type: Number,
    // This field is required, and a custom error message is provided
    required: [true, "Please enter product price"],
    // The max length of the product price is set to 5 characters, with a custom error message
    maxLength: [5, "Product price cannot exceed 5 characters"],
    // The default value is set to 0.0
    default: 0.0,
  },

  // A description of the product
  description: {
    type: String,
    // This field is required, and a custom error message is provided
    required: [true, "Please enter product description"],
  },

  // The average rating of the product
  ratings: {
    type: Number,
    // The default value is set to 0
    default: 0,
  },

  // An array of images for the product
  images: [
    {
      // The public ID of the image
      public_id: {
        type: String,
        // This field is required
        required: true,
      },

      // The URL of the image
      url: {
        type: String,
        // This field is required
        required: true,
      },
    },
  ],

  // The category the product belongs to
  category: {
    type: String,
    // This field is required, and a custom error message is provided
    required: [true, "Please select category for this product"],

    // The 'enum' option is used to specify a list of acceptable values, with a custom error message
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "Please select correct category for product",
    },
  },

  // The name of the seller
  seller: {
    type: String,
    // This field is required, and a custom error message is provided
    required: [true, "Please enter product seller"],
  },

  // The stock of the product
  stock: {
    type: Number,
    // This field is required, and a custom error message is provided
    required: [true, "Please enter product stock"],
    // The max length of the product stock is set to 5 characters, with a custom error message
    maxLength: [5, "Product stock cannot exceed 5 characters"],
    // The default value is set to 0
    default: 0,
  },
  // Define the number of reviews field
  numOfReviews: {
    type: Number,
    // Default value if none is provided
    default: 0,
  },

  // Define the reviews field as an array of objects
  reviews: [
    {
      // user: {
      //     Reference to the User model
      //     type: mongoose.Schema.ObjectId,
      //     ref: 'User',
      //     Mark the user field as required
      //     required: true
      // },

      // Define the name field
      name: {
        type: String,
        // Mark the name field as required
        required: true,
      },

      // Define the rating field
      rating: {
        type: Number,
        // Mark the rating field as required
        required: true,
      },

      // Define the comment field
      comment: {
        type: String,
        // Mark the comment field as required
        required: true,
      },
    },
  ],

  // The date when the product was added to the database
  dateAdded: {
    type: Date,
    // The default value is set to the current date and time
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false, // By default, new documents are not deleted
  },
  deletedAt: {
    type: Date,
    default: null, // By default, the deletedAt field is null
  },
});

// Soft delete a document by setting the isDeleted field to true and the deletedAt field to the current date
productSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  return this.save();
};

// Hard delete a document by calling the deleteOne method
productSchema.methods.hardDelete = function () {
  return this.deleteOne();
};

// Restore a deleted document by setting the isDeleted field to false and the deletedAt field to null
productSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model("Product", productSchema);
