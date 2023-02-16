const Product = require("../models/product");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const tryCatch = require("../utils/tryCatch");
const mongoose = require("mongoose");

//get all products
exports.getProducts = tryCatch(async (req, res, next) => {
  // Find all products in the database and sort them by the createdAt field in descending order
  const products = await Product.find().sort({ createdAt: -1 });

  setTimeout(() => {
    res.status(200).json({
      success: true,
      productsCount: products.length,
      products,
    });
  }, 1000); //loading
  // Define the data object with the necessary values
  // const data = {
  //   productsCount: products.length,
  //   products,
  // };
  // Call the SuccessHandler function with the data object
  // SuccessHandler(res, "Success", data);
});

//get single product
exports.getSingleProduct = tryCatch(async (req, res, next) => {
  // Get the ID from the request parameters
  const { id } = req.params;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid ID"));

  // Find the product with the specified ID
  const product = await Product.findById(id);

  // Check if the product was found
  if (!product) return next(new ErrorHandler("Not found"));

  // Return a JSON response with success status and the product information
  // SuccessHandler(res, product);
  res.status(200).json({
    success: true,
    product,
  });
});

//create new product
exports.newProduct = tryCatch(async (req, res, next) => {
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

  // Create a new product using the data from the request body
  const product = await Product.create(req.body);

  // Return a JSON response with success status and the newly created product
  // SuccessHandler(res, product);
  res.status(200).json({
    success: true,
    product,
  });
});

//update a product
exports.updateProduct = tryCatch(async (req, res, next) => {
  // Get the ID of the product from the request parameters
  const { id } = req.params;

  // Check if the given ID is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    // Return a 400 error response with a message if the ID is invalid
    return next(new ErrorHandler("Invalid ID"));

  // Find and update the product with the given ID using the new data from the request body
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  // If no product was found, return a 400 error response with a message
  if (!product) return next(new ErrorHandler("Not found"));

  // Return a success response with the updated product
  // SuccessHandler(res, product);
  res.status(200).json({
    success: true,
    product,
  });
});

// Soft delete a product by setting the isDeleted field to true and the deletedAt field to the current date
exports.softDeleteProduct = tryCatch(async (req, res, next) => {
  // Extract the product ID from the request parameters
  const { id } = req.params;

  // Check if the given ID is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    // Return a 400 error response with a message if the ID is invalid
    return next(new ErrorHandler("Invalid ID"));

  // Find the product by ID
  const product = await Product.findById(id);

  // If the product is not found, return an error using the next function
  if (!product) return next(new ErrorHandler("Product not found"));

  // Call the softDelete method on the product to set the isDeleted and deletedAt fields
  await product.softDelete();

  // Return a success message using the SuccessHandler function
  // SuccessHandler(res, "Product soft deleted");
  res.status(200).json({
    success: true,
    message: "Product soft deleted",
  });
});

// Hard delete a product by calling the deleteOne method
exports.hardDeleteProduct = tryCatch(async (req, res, next) => {
  // Extract the product ID from the request parameters
  const { id } = req.params;

  // Check if the given ID is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    // Return a 400 error response with a message if the ID is invalid
    return next(new ErrorHandler("Invalid ID"));

  // Find the product by ID
  const product = await Product.findById(id);

  // If the product is not found, return an error using the next function
  if (!product) return next(new ErrorHandler("Product not found"));

  // Call the hardDelete method on the product to delete it from the database
  await product.hardDelete();

  // Return a success message using the SuccessHandler function
  // SuccessHandler(res, "Product hard deleted");
  res.status(200).json({
    success: true,
    message: "Product hard deleted",
  });
});

// Restore a deleted product by setting the isDeleted field to false and the deletedAt field to null
exports.restoreProduct = tryCatch(async (req, res, next) => {
  // Extract the product ID from the request parameters
  const { id } = req.params;

  // Check if the given ID is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    // Return a 400 error response with a message if the ID is invalid
    return next(new ErrorHandler("Invalid ID"));

  // Find the product by ID
  const product = await Product.findById(id);

  // If the product is not found, return an error using the next function
  if (!product) return next(new ErrorHandler("Product not found"));

  // Call the restore method on the product to set the isDeleted and deletedAt fields
  await product.restore();

  // Return a success message using the SuccessHandler function
  // SuccessHandler(res, "Product restored");
  res.status(200).json({
    success: true,
    message: "Product restored",
  });
});

exports.getProductsPagination = tryCatch(async (req, res, next) => {
  // Define the number of results to display per page
  const resPerPage = 4;

  // Get the current page from the query parameters or set it to 1 if not provided
  const currentPage = Number(req.query.page) || 1;

  // Use Promise.all to fetch products and productsCount in parallel
  const [products, productsCount] = await Promise.all([
    // Create an instance of the APIFeatures class
    new APIFeatures(Product.find(), req.query)
      .search() // Apply search
      .filter() // Apply filter
      .pagination(resPerPage).query, // Apply pagination & Execute the query and return the results
    // Count the total number of products
    Product.countDocuments(),
  ]);

  // Define the data object with the necessary values
  const data = {
    currentPage,
    totalPages: Math.ceil(productsCount / resPerPage),
    productsCount,
    productsLength: products.length,
    products,
  };

  // Call the SuccessHandler function with the data object
  // SuccessHandler(res, "Fetch All The Products", data);
  res.status(200).json({
    success: true,
    message: "Product soft deleted",
    data,
  });
});
