const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); // Import path module for file extensions
const {
  getProducts,
  getProductById,
  getProductFilter,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save the files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to avoid name conflicts
  },
});

// Initialize multer with storage config and multiple files support (up to 10)
const upload = multer({ storage: storage }).array("productImages", 10); // This is for multiple file uploads

// Route to get filter options for products
router.get('/filters', getProductFilter);

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to get multiple products (with filtering and pagination)
router.get('/', getProducts);

// Route to create a new product with image upload
router.post('/', upload, createProduct);  // Use 'upload' middleware for multiple files

// Route to update a product by ID (with image upload)
router.put('/:id', upload, updateProduct); // Use 'upload' middleware for multiple files

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

// Error handler for multer
// This will catch any errors related to file uploads and send them back in the response
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // If the error is a MulterError (e.g., file size exceeded)
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    // General error (like invalid file type)
    return res.status(400).json({ message: err.message });
  }
  next(); // If no error, pass control to the next middleware
});

module.exports = router;
