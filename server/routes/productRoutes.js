const express = require('express');
const router = express.Router();

// Importing the controller functions
const { getProducts, getProductById } = require('../controllers/productController');

// Logging Middleware (optional but useful for debugging)
router.use((req, res, next) => {
    console.log(`Product route hit: ${req.method} ${req.originalUrl}`);
    next(); // Proceed to the next middleware or route handler
});

// Define the route for getting a single product by ID
router.get('/:id', getProductById);

// Define the route for getting a list of products with pagination, filters, etc.
router.get('/', getProducts);

module.exports = router;
