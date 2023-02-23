const express = require("express");
const router = express.Router();

// Import product controller
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
  hardDeleteProduct,
  getProductsPagination,
} = require("../controllers/productController");

// Import authentication middlewares
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Get all products
router.get(
  "/products",
  // isAuthenticatedUser,
  // authorizeRoles("admin"),
  getProducts
);

// Add a new product
router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newProduct
);

// Get a single product by ID
router.get("/product/:id", getSingleProduct);

// Update a product by ID
router.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateProduct
);

// Hard Delete a product by ID
router.delete(
  "/admin/product/hardDelete/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hardDeleteProduct
);

// Soft deleting a product by ID
router.delete(
  "/admin/product/softDelete/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  softDeleteProduct
);

// Restoring a product by ID
router.patch(
  "/admin/product/restore/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  restoreProduct
);

module.exports = router;
