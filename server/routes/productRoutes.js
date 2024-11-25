const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getProductFilter } = require('../controllers/productController');

router.get('/filters', getProductFilter);

router.get('/:id', getProductById);

router.get('/', getProducts);

module.exports = router;
