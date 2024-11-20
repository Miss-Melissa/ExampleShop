const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');

// Hämta alla produkter
router.get('/', getProducts);

module.exports = router;
