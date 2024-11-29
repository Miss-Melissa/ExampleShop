const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getProducts, getProductById, getProductFilter, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Set up upload directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory exists
}

// Set up multer storage engine to save files with a timestamp to avoid conflicts
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the defined 'uploads/' directory
    },
    filename: (req, file, cb) => {
        // Use timestamp to avoid file name conflicts
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Multer upload setup, allowing multiple files (up to 5 files, 5MB each)
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const mimeType = allowedTypes.test(file.mimetype);
        if (mimeType) {
            return cb(null, true); // Accept file
        } else {
            return cb(new Error('Invalid file type! Only JPG, JPEG, and PNG are allowed.'));
        }
    },
});

// Routes
router.get('/', getProducts);
router.get('/filters', getProductFilter);
router.get('/:id', getProductById);
router.post('/', upload.array('productImages', 5), createProduct); // Handle file uploads for product creation
router.put('/:id', upload.array('productImages', 5), updateProduct); // Handle file uploads for product update
router.delete('/:id', deleteProduct);

module.exports = router;
