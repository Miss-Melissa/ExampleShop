const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Function to fetch distinct filter options
const getProductFilter = async (req, res) => {
    try {
        const categories = await Product.distinct('productCategory');
        const colors = await Product.distinct('productColor');
        const brands = await Product.distinct('productBrand');
        const sizes = await Product.distinct('productSize');
        res.json({ categories, colors, brands, sizes });
    } catch (err) {
        console.error('Error fetching filter options:', err.message);
        res.status(500).json({ message: 'Error fetching filter options' });
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
        limit = 10,
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;

    const minPrice = parseFloat(price_min) || 0;
    const maxPrice = parseFloat(price_max) || Infinity;

    const sizeArray = size ? size.split(',').map((s) => s.trim()) : [];
    const categoryArray = category ? category.split(',').map((c) => c.trim()) : [];

    const searchCriteria = {
        ...(query && { productName: { $regex: query, $options: 'i' } }),
        ...(categoryArray.length && { productCategory: { $in: categoryArray } }),
        ...(color && { productColor: { $regex: color, $options: 'i' } }),
        ...(brand && { productBrand: { $regex: brand, $options: 'i' } }),
        ...(gender && { productGender: { $regex: gender, $options: 'i' } }),
        ...(sizeArray.length && { productSize: { $in: sizeArray } }),
        productPrice: { $gte: minPrice, $lte: maxPrice },
    };

    try {
        const totalProducts = await Product.countDocuments(searchCriteria);
        const products = await Product.find(searchCriteria)
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);

        res.json({
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / parsedLimit),
            currentPage: parsedPage,
        });
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

// Function to get a product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error fetching product by ID:', err.message);
        res.status(500).json({ message: 'Error fetching product by ID' });
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
            productGender,
        } = req.body;

        // Validate required fields
        if (!productName || !productPrice || !productQuantity || !productCategory || !productBrand || !productColor || !productGender) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const productImages = req.files ? req.files.map((file) => file.filename) : [];
        if (!productImages.length) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        const parsedSize = Array.isArray(productSize) ? productSize : JSON.parse(productSize);

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
            productImages,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err.message);
        res.status(500).json({ message: 'Error creating product' });
    }
};

// Function to update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
      productName,
      productPrice,
      productDescription,
      productQuantity,
      productSize,
      productCategory,
      productBrand,
      productColor,
      productGender,
    } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
  
    try {
      // Ensure productCategory is parsed as an array
      const parsedCategory = Array.isArray(productCategory) ? productCategory : JSON.parse(productCategory || '[]');
      const parsedSize = Array.isArray(productSize) ? productSize : JSON.parse(productSize || '[]');
  
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Handle uploaded images
      const newImages = req.files ? req.files.map((file) => file.filename) : [];
      const updatedImages = [
        ...existingProduct.productImages, // Retain old images
        ...newImages,                    // Add new images
      ];
  
      // Update product in the database
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          productName,
          productCategory: parsedCategory,  // Ensure category is an array
          productColor,
          productBrand,
          productGender,
          productSize: parsedSize,         // Ensure size is an array
          productPrice,
          productDescription,
          productQuantity,
          productImages: updatedImages,
        },
        { new: true }
      );
  
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Error updating product', error: err.message });
    }
  };
  
  



// Function to delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product successfully deleted' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductFilter,
    createProduct,
    updateProduct,
    deleteProduct,
};
