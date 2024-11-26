const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getProducts, getProductById, getProductFilter, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Set up multer storage engine to save files with a timestamp to avoid conflicts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer upload setup, allowing multiple files (up to 10)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimeType = allowedTypes.test(file.mimetype);
    if (mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type!'));
    }
  },
});

// Routes
router.get('/', getProducts);
router.get('/filters', getProductFilter);
router.get('/:id', getProductById);
router.post('/', upload.array('productImages', 5), createProduct);
router.put('/:id', upload.array('productImages', 5), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;


