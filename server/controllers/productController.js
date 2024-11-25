const Product = require('../models/productModel');
const mongoose = require('mongoose');

const getProducts = async (req, res) => {
    const {
        query, category, color, brand, gender, size,
        price_min, price_max, page = 1, limit = 10
    } = req.query;

    console.log('Received filters:', { query, category, color, brand, gender, size, price_min, price_max });

    // Parse page and limit as numbers
    const parsedPage = parseInt(page, 10) || 1; // Default to 1 if not provided
    const parsedLimit = parseInt(limit, 10) || 10; // Default to 10 if not provided

    // Parse price_min and price_max as numbers
    const minPrice = price_min ? parseFloat(price_min) : undefined;
    const maxPrice = price_max ? parseFloat(price_max) : undefined;

    // Parse the size parameter if provided
    const sizeArray = size ? size.split(',').map(s => s.trim()) : [];

    // Build search criteria dynamically
    const searchCriteria = {
        ...(query && { productName: { $regex: query, $options: 'i' } }),
        ...(category && { productCategory: { $regex: category, $options: 'i' } }),
        ...(color && { productColor: { $regex: color, $options: 'i' } }),
        ...(brand && { productBrand: { $regex: brand, $options: 'i' } }),
        ...(gender && { productGender: { $regex: gender, $options: 'i' } }),
        ...(sizeArray.length > 0 && { productSize: { $in: sizeArray } }), // Ensure size is an array if it's provided
        ...(minPrice && maxPrice && { productPrice: { $gte: minPrice, $lte: maxPrice } }),
        ...(minPrice && !maxPrice && { productPrice: { $gte: minPrice } }),
        ...(maxPrice && !minPrice && { productPrice: { $lte: maxPrice } }),
    };

    try {
        // Validate pagination values
        if (parsedPage < 1 || parsedLimit < 1) {
            return res.status(400).json({ message: 'Page and limit must be greater than 0' });
        }

        // Count total products based on search criteria
        const totalProducts = await Product.countDocuments(searchCriteria);

        // Fetch products with pagination
        const products = await Product.find(searchCriteria)
            .skip((parsedPage - 1) * parsedLimit) // Skip based on page number
            .limit(parsedLimit); // Limit to the number of items per page

        if (!products.length) {
            return res.status(404).json({ message: 'No products found matching the criteria' });
        }

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalProducts / parsedLimit);
        res.json({ products, totalPages });
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid or missing product ID:', id);
        return res.status(400).json({ message: 'Invalid product ID format' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            console.log('Product not found with ID:', id);
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error fetching product by ID:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
};
