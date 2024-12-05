const Product = require("../models/productModel");
const mongoose = require("mongoose");

// Function to fetch distinct filter options
const getProductFilter = async (req, res) => {
  const { category, color, size, brand, gender } = req.query;

  try {
    // Initialize the search criteria based on selected filters
    const searchCriteria = {};

    // If category is selected, filter based on productCategory
    if (category) {
      const categoryArray = category.split(',').map(c => c.trim());
      searchCriteria.productCategory = { $in: categoryArray };
    }

    // If color is selected, filter based on productColor
    if (color) {
      searchCriteria.productColor = { $regex: `^${color}$`, $options: 'i' };
    }

    // If size is selected, filter based on productSize
    if (size) {
      const sizeArray = size.split(',').map(s => s.trim());
      searchCriteria.productSize = { $in: sizeArray };
    }

    // If brand is selected, filter based on productBrand
    if (brand) {
      searchCriteria.productBrand = { $regex: `^${brand}$`, $options: 'i' };
    }

    // If gender is selected, normalize and filter based on productGender
    if (gender) {
      const formattedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(); // Normalize gender
      searchCriteria.productGender = { $regex: `^${formattedGender}$`, $options: 'i' };
    }

    // Fetch the distinct filter options based on the search criteria
    const categories = await Product.distinct("productCategory", searchCriteria);
    const colors = await Product.distinct("productColor", searchCriteria);
    const brands = await Product.distinct("productBrand", searchCriteria);
    const genders = await Product.distinct("productGender", searchCriteria);
    const sizes = await Product.distinct("productSize", searchCriteria);

    // Send back the available filter options
    res.json({
      categories,
      colors,
      brands,
      sizes,
      genders,
    });
  } catch (err) {
    console.error("Error fetching filter options:", err.message);
    res.status(500).json({ message: "Error fetching filter options" });
  }
};

const getProductSearch = async (req, res) => {
  const {
    searchQuery,
    category,
    color,
    size,
    brand,
    gender,
    price_min,
    price_max,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const searchCriteria = {};

    // Generic search query (exclude gender here for precision)
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = { $regex: searchQuery, $options: 'i' };
      searchCriteria.$or = [
        { productName: searchRegex },
        { productCategory: searchRegex },
        { productBrand: searchRegex },
        { productColor: searchRegex },
        { productGender: searchRegex },
      ];
    }

    // Explicit gender filter (if provided)
    if (gender && gender.trim()) {
      searchCriteria.productGender = { $regex: `^${gender}$`, $options: 'i' };
    }

    // Apply other filters (category, color, size, brand, price)
    if (category && category.trim()) {
      searchCriteria.productCategory = { $regex: category, $options: 'i' };
    }

    if (color && color.trim()) {
      searchCriteria.productColor = { $regex: color, $options: 'i' };
    }

    if (brand && brand.trim()) {
      searchCriteria.productBrand = { $regex: brand, $options: 'i' };
    }

    if (size && size.trim()) {
      searchCriteria.productSize = size;
    }

    // Apply price range filters
    if (price_min || price_max) {
      searchCriteria.productPrice = {};
      if (price_min) searchCriteria.productPrice.$gte = parseFloat(price_min);
      if (price_max) searchCriteria.productPrice.$lte = parseFloat(price_max);
    }

    const skip = (page - 1) * limit;

    // Fetch products from DB with applied filters
    const products = await Product.find(searchCriteria)
      .skip(skip)
      .limit(parseInt(limit));

    // Count total products for pagination
    const totalProducts = await Product.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get the available filters based on the current search criteria
    const categories = await Product.distinct("productCategory", searchCriteria);
    const colors = await Product.distinct("productColor", searchCriteria);
    const brands = await Product.distinct("productBrand", searchCriteria);
    const sizes = await Product.distinct("productSize", searchCriteria);

    // Send back the search results and dynamic filter options
    res.json({
      products,
      totalProducts,
      totalPages,
      filters: {
        categories,
        colors,
        brands,
        sizes,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};




const getProducts = async (req, res) => {
  const {
    query = "", // Search term for product names
    category = "", // Comma-separated categories
    color = "", // Single color
    brand = "", // Single brand
    gender = "", // Single gender
    size = "", // Comma-separated sizes
    price_min = 0, // Minimum price
    price_max = 1000, // Maximum price
    page = 1, // Page number
    limit = 10, // Number of products per page
  } = req.query;

  // Parse numerical values with fallback defaults
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1); // Ensure page >= 1
  const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1); // Ensure limit >= 1
  const minPrice = Math.max(parseFloat(price_min) || 0, 0); // Ensure non-negative price
  const maxPrice = parseFloat(price_max) || Infinity; // Allow upper price to default to Infinity

  // Parse comma-separated filters into arrays
  const sizeArray = size ? size.split(",").map((s) => s.trim()) : [];
  const categoryArray = category
    ? category.split(",").map((c) => c.trim())
    : [];

  // Build search criteria for MongoDB query
  const searchCriteria = {
    ...(query && { productName: { $regex: query, $options: "i" } }), // Case-insensitive regex for product name
    ...(categoryArray.length && { productCategory: { $in: categoryArray } }), // Match any of the given categories
    ...(color && { productColor: { $regex: `^${color}$`, $options: "i" } }), // Case-insensitive match for color
    ...(brand && { productBrand: { $regex: `^${brand}$`, $options: "i" } }), // Case-insensitive match for brand
    ...(gender && { productGender: { $regex: `^${gender}$`, $options: "i" } }), // Case-insensitive match for gender
    ...(sizeArray.length && { productSize: { $in: sizeArray } }), // Match any of the given sizes
    productPrice: { $gte: minPrice, $lte: maxPrice }, // Price range
  };

  try {
    // Count total matching products
    const totalProducts = await Product.countDocuments(searchCriteria);

    // Fetch paginated products
    const products = await Product.find(searchCriteria)
      .skip((parsedPage - 1) * parsedLimit) // Calculate offset
      .limit(parsedLimit) // Limit results per page
      .lean(); // Use lean() to optimize read performance if only retrieving data

    // Send response with pagination metadata
    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / parsedLimit),
      currentPage: parsedPage,
      hasNextPage: parsedPage < Math.ceil(totalProducts / parsedLimit),
      hasPreviousPage: parsedPage > 1,
    });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Function to get a product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  console.log("Received request for product ID:", id); // Log the ID

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

    console.log("Received fields:", req.body);
    console.log("Received files:", req.files);

    // Validate required fields
    if (
      !productName ||
      !productPrice ||
      !productDescription ||
      !productQuantity ||
      !productSize ||
      !productCategory ||
      !productBrand ||
      !productColor ||
      !productGender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize productGender to lowercase for consistency
    const formattedGender = productGender.trim().toLowerCase();
    const validGenders = ["men", "women", "unisex"];
    if (!validGenders.includes(formattedGender)) {
      return res.status(400).json({ message: "Invalid gender value" });
    }

    // Standardize gender to proper format (Capitalized)
    const formattedGenderProperCase = formattedGender.charAt(0).toUpperCase() + formattedGender.slice(1);

    // Handle product categories: Parse if it's not already an array
    let parsedCategory = Array.isArray(productCategory)
      ? productCategory
      : productCategory.split(",").map((item) => item.trim());

    // Handle product sizes: Parse if it's not already an array
    let parsedSize = Array.isArray(productSize)
      ? productSize
      : typeof productSize === "string"
      ? productSize.split(",").map((item) => item.trim()) // Split by commas
      : [];

    // Validate parsed size
    if (!parsedSize.length) {
      return res
        .status(400)
        .json({ message: "At least one product size is required" });
    }

    // Handle product images
    const productImages = req.files
      ? req.files.map((file) => file.filename)
      : [];
    if (!productImages.length) {
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }

    // Create a new product document
    const newProduct = new Product({
      productName,
      productPrice,
      productDescription,
      productQuantity,
      productSize: parsedSize,
      productCategory: parsedCategory,
      productBrand,
      productColor,
      productGender: formattedGenderProperCase, // Store the normalized gender value
      productImages, // Filenames saved from uploads
    });

    await newProduct.save();

    // Respond with success
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (err) {
    console.error("Error creating product:", err.message); // Log the full error message
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
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
    deletedImages = [],
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    // Parse productCategory and productSize as arrays if not already
    const parsedCategory = Array.isArray(productCategory)
      ? productCategory
      : JSON.parse(productCategory || "[]");
    const parsedSize = Array.isArray(productSize)
      ? productSize
      : JSON.parse(productSize || "[]");

    // Retrieve the existing product from the database
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle uploaded images (new images)
    const newImages = req.files ? req.files.map((file) => file.filename) : [];

    // Filter out the deleted images from the existing images array
    const updatedImages = existingProduct.productImages.filter(
      (image) => !deletedImages.includes(image)
    );

    // Add new images to the remaining images
    const finalImages = [...updatedImages, ...newImages];

    // Update product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productCategory: parsedCategory,
        productColor,
        productBrand,
        productGender,
        productSize: parsedSize,
        productPrice,
        productDescription,
        productQuantity,
        productImages: finalImages,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

// Function to delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product successfully deleted" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductFilter,
  getProductSearch,
  createProduct,
  updateProduct,
  deleteProduct,
};
