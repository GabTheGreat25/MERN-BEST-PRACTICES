const Product = require("../models/product");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");

//get all products
exports.getProducts = async (req, res, next) => {
  try {
    // Find all products in the database and sort them by the createdAt field in descending order
    const products = await Product.find().sort({ createdAt: -1 });

    // Return a JSON response with success status, the count of products, and the array of products
    return res.json({ success: true, count: products.length, products });
  } catch (error) {
    // If an error occurs, return a JSON response with an error status and the error message
    return res.status(500).json({ success: false, message: error.message });
  }
};

//get single product
exports.getSingleProduct = async (req, res, next) => {
  try {
    // Get the ID from the request parameters
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    // Find the product with the specified ID
    const product = await Product.findById(id);

    // Check if the product was found
    if (!product)
      return res.status(400).json({ success: false, message: "Not found" });

    // Return a JSON response with success status and the product information
    return res.json({ success: true, product });
  } catch (error) {
    // Return a JSON response with an error status and the error message
    return res.status(500).json({ success: false, message: error.message });
  }
};

//create new product
exports.newProduct = async (req, res, next) => {
  const requiredFields = [
    "name",
    "price",
    "description",
    "ratings",
    "images",
    "category",
    "seller",
    "stock",
    "numOfReviews",
    "reviews",
  ];

  // Check if there are any missing required fields in the request body
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  // If any required fields are missing, return a 400 Bad Request response with the errors
  if (missingFields.length) {
    const errors = missingFields.map((field) => ({
      [field]: `${field} is required`,
    }));
    return res.status(400).json({ errors });
  }

  try {
    // Create a new product using the data from the request body
    const product = await Product.create(req.body);

    // Return a JSON response with success status and the newly created product
    return res.json({ success: true, product });
  } catch (error) {
    // If there was an error creating the product, return a 500 Internal Server Error response with the error message
    return res.status(500).json({ error: error.message });
  }
};

//update a product
exports.updateProduct = async (req, res, next) => {
  // Get the ID of the product from the request parameters
  const { id } = req.params;

  // Check if the given ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // Return a 400 error response with a message if the ID is invalid
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    // Find and update the product with the given ID using the new data from the request body
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    // If no product was found, return a 400 error response with a message
    if (!product) {
      return res.status(400).json({ success: false, message: "Not found" });
    }

    // Return a success response with the updated product
    return res.json({ success: true, product });
  } catch (error) {
    // Return a response with the error message
    return res.status(500).json({ error: error.message });
  }
};

//delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const product = await Product.findOneAndDelete({ _id: id });

    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    // Declare the number of results per page
    const resPerPage = 4;

    // Count the total number of products
    const productsCount = await Product.countDocuments();

    // Create an instance of the API Features class
    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter();

    // Apply pagination
    apiFeatures.pagination(resPerPage);

    // Get the products
    const products = await apiFeatures.query;

    // Return the response
    res.status(200).json({
      success: true,
      count: products.length,
      productsCount,
      products,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
