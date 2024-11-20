const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// Log to see if the route is hit
router.get('/', (req, res, next) => {
    console.log('GET /products is being called');
    next();
});

// Log to see if the route is hit for a single product
router.get('/:id', (req, res, next) => {
    console.log('GET /products/:id is being called');
    next();
});

router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
