const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Function to fetch distinct filter options from the database
const getProductFilter = async (req, res) => {
    try {
        // Fetch distinct values for category, color, brand, size
        const categories = await Product.distinct('productCategory');
        const colors = await Product.distinct('productColor');
        const brands = await Product.distinct('productBrand');
        const sizes = await Product.distinct('productSize');

        // Return the filter options in a single response
        res.json({ categories, colors, brands, sizes });
    } catch (err) {
        console.error('Error fetching filter options:', err.message);
        res.status(500).json({ message: 'Server error while fetching filter options' });
    }
};

// Function to get filtered products with pagination
const getProducts = async (req, res) => {
    const {
        query = '', // Default to empty string if not provided
        category = '',
        color = '',
        brand = '',
        gender = '',
        size = '',
        price_min = 0,
        price_max = 1000,
        page = 1,
        limit = 10
    } = req.query;

    console.log('Received filters:', { query, category, color, brand, gender, size, price_min, price_max });

    // Parse page and limit as numbers
    const parsedPage = parseInt(page, 10) || 1; // Default to 1 if not provided
    const parsedLimit = parseInt(limit, 10) || 10; // Default to 10 if not provided

    // Parse price_min and price_max as numbers, with default values if not provided
    const minPrice = price_min ? parseFloat(price_min) : undefined;
    const maxPrice = price_max ? parseFloat(price_max) : undefined;

    // Parse the size parameter if provided (size should be a comma-separated list or an array)
    const sizeArray = Array.isArray(size) ? size : size ? size.split(',').map(s => s.trim()) : [];

    // Parse the category parameter if it's a comma-separated list or an array
    const categoryArray = Array.isArray(category) ? category : category ? category.split(',').map(c => c.trim()) : [];

    // Build search criteria dynamically
    const searchCriteria = {
        ...(query && { productName: { $regex: query, $options: 'i' } }),  // Regex search for case-insensitive matching
        ...(categoryArray.length > 0 && { productCategory: { $in: categoryArray } }),  // Match multiple categories
        ...(color && { productColor: { $regex: color, $options: 'i' } }),
        ...(brand && { productBrand: { $regex: brand, $options: 'i' } }),
        ...(gender && { productGender: { $regex: gender, $options: 'i' } }),
        ...(sizeArray.length > 0 && { productSize: { $in: sizeArray } }), // Size filter should be an array
        ...(minPrice && maxPrice && { productPrice: { $gte: minPrice, $lte: maxPrice } }),  // Both min and max price
        ...(minPrice && !maxPrice && { productPrice: { $gte: minPrice } }),  // Only min price
        ...(maxPrice && !minPrice && { productPrice: { $lte: maxPrice } }),  // Only max price
    };

    try {
        // Validate pagination values: ensure page and limit are greater than 0
        if (parsedPage < 1 || parsedLimit < 1) {
            return res.status(400).json({ message: 'Page and limit must be greater than 0' });
        }

        // Count total products based on search criteria
        const totalProducts = await Product.countDocuments(searchCriteria);

        // Fetch products with pagination
        const products = await Product.find(searchCriteria)
            .skip((parsedPage - 1) * parsedLimit) // Skip based on page number
            .limit(parsedLimit) // Limit to the number of items per page

        // If no products found, return a 404 response
        if (!products.length) {
            return res.status(404).json({ message: 'No products found matching the criteria' });
        }

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalProducts / parsedLimit);

        // Return the filtered products with pagination details
        res.json({
            products,
            totalPages,
            currentPage: parsedPage,
            totalProducts
        });

    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

// Function to get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    // Validate the product ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid or missing product ID:', id);
        return res.status(400).json({ message: 'Invalid product ID format' });
    }

    try {
        // Fetch the product by ID
        const product = await Product.findById(id);

        if (!product) {
            console.log('Product not found with ID:', id);
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the product data
        res.json(product);
    } catch (err) {
        console.error('Error fetching product by ID:', err.message);
        res.status(500).json({ message: 'Server error while fetching product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductFilter, // Export the function for fetching filter options
};
