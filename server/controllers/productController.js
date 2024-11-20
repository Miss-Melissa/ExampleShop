const Product = require('../models/productModel');
const mongoose = require('mongoose');

const getProducts = async (req, res) => {
    console.log('Fetching all products...'); // Log to check if the route is hit
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProductById = async (req, res) => {
    console.log('Fetching product with ID:', req.params.id);

    try {
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid product ID format');
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findById(req.params.id);

        // If no product is found
        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product found:', product); // Log the found product
        res.json(product);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getProducts,
    getProductById
};
