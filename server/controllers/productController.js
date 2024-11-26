const Product = require('../models/productModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Function to fetch distinct filter options from the database
const getProductFilter = async (req, res) => {
    try {
        const categories = await Product.distinct('productCategory');
        const colors = await Product.distinct('productColor');
        const brands = await Product.distinct('productBrand');
        const sizes = await Product.distinct('productSize');
        
        res.json({ categories, colors, brands, sizes });
    } catch (err) {
        console.error('Error fetching filter options:', err.message);
        res.status(500).json({ message: 'Server error while fetching filter options' });
    }
};

// Function to get filtered products with pagination
const getProducts = async (req, res) => {
    const {
        query = '',
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

    // Ensure valid values
    const parsedPage = Math.max(1, parseInt(page, 10));  // Default to 1 if invalid
    const parsedLimit = Math.max(1, parseInt(limit, 10));  // Default to 10 if invalid
    const minPrice = price_min ? parseFloat(price_min) : undefined;
    const maxPrice = price_max ? parseFloat(price_max) : undefined;

    const sizeArray = size ? size.split(',').map(s => s.trim()) : [];
    const categoryArray = category ? category.split(',').map(c => c.trim()) : [];

    const searchCriteria = {
        ...(query && { productName: { $regex: query, $options: 'i' } }),
        ...(categoryArray.length > 0 && { productCategory: { $in: categoryArray } }),
        ...(color && { productColor: { $regex: color, $options: 'i' } }),
        ...(brand && { productBrand: { $regex: brand, $options: 'i' } }),
        ...(gender && { productGender: { $regex: gender, $options: 'i' } }),
        ...(sizeArray.length > 0 && { productSize: { $in: sizeArray } }),
        ...(minPrice && maxPrice && { productPrice: { $gte: minPrice, $lte: maxPrice } }),
        ...(minPrice && !maxPrice && { productPrice: { $gte: minPrice } }),
        ...(maxPrice && !minPrice && { productPrice: { $lte: maxPrice } })
    };

    try {
        if (parsedPage < 1 || parsedLimit < 1) {
            return res.status(400).json({ message: 'Page and limit must be greater than 0' });
        }

        const totalProducts = await Product.countDocuments(searchCriteria);
        const products = await Product.find(searchCriteria)
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);

        if (!products.length) {
            console.log('No products found with filters:', searchCriteria);
            return res.status(404).json({ message: 'No products found matching the criteria' });
        }

        const totalPages = Math.ceil(totalProducts / parsedLimit);

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
        res.status(500).json({ message: 'Server error while fetching product' });
    }
};

// Function to create a new product
const createProduct = async (req, res) => {
    try {
        const { 
            productName, 
            productPrice, 
            productDescription, 
            productQuantity, 
            productSize, 
            productCategory, 
            productBrand, 
            productColor, 
            productGender 
        } = req.body;

        const productImages = req.files ? req.files.map(file => file.filename) : [];

        if (!productName || !productPrice || !productQuantity || productImages.length === 0 || !productSize || !productCategory || !productBrand || !productColor || !productGender) {
            return res.status(400).json({ message: 'All fields are required, including at least one image' });
        }

        const parsedSize = Array.isArray(JSON.parse(productSize)) ? JSON.parse(productSize) : [];

        const newProduct = new Product({
            productName,
            productPrice,
            productDescription,
            productQuantity,
            productSize: parsedSize,
            productCategory,
            productBrand,
            productColor,
            productGender,
            productImages
        });

        await newProduct.save();
        return res.status(201).json(newProduct);

    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Error creating product', error });
    }
};

// Function to update a product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { productName, productCategory, productColor, productBrand, productGender, productSize, productPrice, productDescription } = req.body;

        const productImages = req.files ? req.files.map(file => file.filename) : [];
        const deletedImages = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : [];

        deletedImages.forEach((image) => {
            const imagePath = path.join(__dirname, '../uploads', image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete image: ${image}`, err);
                    } else {
                        console.log(`Image deleted: ${image}`);
                    }
                });
            }
        });

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                productName,
                productCategory,
                productColor,
                productBrand,
                productGender,
                productSize,
                productPrice,
                productDescription,
                productImages: [...productImages],
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};

// Function to delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid or missing product ID:', id);
        return res.status(400).json({ message: 'Invalid product ID format' });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product successfully deleted' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Server error while deleting product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductFilter,
    createProduct,
    updateProduct,
    deleteProduct
};
