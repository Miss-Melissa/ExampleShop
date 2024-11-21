const Product = require('../models/productModel');
const mongoose = require('mongoose');


const getProducts = async (req, res) => {
    console.log('Fetching products with filters...');
    
    const { category, query, page = 1, limit = 10, price_min, price_max } = req.query;

    let searchCriteria = {};  // Initialize search criteria

    // Filter by category if provided
    if (category) {
        searchCriteria.productCategory = { $regex: category, $options: 'i' }; // Case-insensitive category search
    }

    // Filter by product name if provided
    if (query) {
        searchCriteria.productName = { $regex: query, $options: 'i' }; // Case-insensitive product name search
    }

    // Optional price range filter
    if (price_min && price_max) {
        searchCriteria.productPrice = { $gte: price_min, $lte: price_max };
    } else if (price_min) {
        searchCriteria.productPrice = { $gte: price_min }; // Only min price filter
    } else if (price_max) {
        searchCriteria.productPrice = { $lte: price_max }; // Only max price filter
    }

    try {
        const skip = (page - 1) * limit;  // Pagination
        const products = await Product.find(searchCriteria)
            .skip(skip)
            .limit(Number(limit));

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the criteria' });
        }

        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get a single product by ID
const getProductById = async (req, res) => {
    console.log('Fetching product with ID:', req.params.id);

    try {
        // Validate product ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid product ID format');
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findById(req.params.id);

        // If no product found, return an error message
        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product found:', product);
        res.json(product); // Return the product data
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProducts,
    getProductById
};
