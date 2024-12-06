const Product = require("../models/productModel");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    // Hämta alla produkter utan några filter eller pagination
    const products = await Product.find({});

    // Skicka tillbaka alla produkter
    res.status(200).json({
      products,
      totalProducts: products.length,  // Antal produkter som finns
      totalPages: 1,  // Eftersom vi hämtar alla, sätts det till 1
      currentPage: 1,  // Sätt nuvarande sida till 1
      hasNextPage: false,  // Eftersom vi hämtar alla, finns det ingen nästa sida
      hasPreviousPage: false,  // Eftersom vi hämtar alla, finns det ingen föregående sida
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Funktion som hämtar filteralternativ baserat på sökning och filtrering
const getProductFilter = async (req, res) => {
  const {
    searchQuery,
    category,
    color,
    size,
    brand,
    gender,
    price_min,
    price_max,
  } = req.query;

  try {
    const searchCriteria = {};

    // Search query handling
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery, "i");
      searchCriteria.$or = [
        { productName: searchRegex },
        { productCategory: searchRegex },
        { productBrand: searchRegex },
        { productColor: searchRegex },
        { productGender: searchRegex },
      ];
    }

    // Add other filter criteria
    if (category) {
      searchCriteria.productCategory = {
        $in: category.split(",").map((c) => c.trim()),
      };
    }
    if (color) {
      searchCriteria.productColor = { $regex: `^${color}$`, $options: "i" }; // Fix regex for color
    }
    if (size) {
      searchCriteria.productSize = {
        $in: size.split(",").map((s) => s.trim()),
      };
    }
    if (brand) {
      searchCriteria.productBrand = { $regex: `^${brand}$`, $options: "i" }; // Fix regex for brand
    }
    if (gender) {
      searchCriteria.productGender = { $regex: `^${gender}$`, $options: "i" }; // Fix regex for gender
    }

    // Price filter handling (min and max price)
    if (price_min && price_max) {
      searchCriteria.productPrice = {
        $gte: parseFloat(price_min),
        $lte: parseFloat(price_max),
      };
    } else if (price_min) {
      searchCriteria.productPrice = { $gte: parseFloat(price_min) };
    } else if (price_max) {
      searchCriteria.productPrice = { $lte: parseFloat(price_max) };
    }

    // Fetch distinct filter options based on the search criteria
    const categories = await Product.distinct(
      "productCategory",
      searchCriteria
    );
    const colors = await Product.distinct("productColor", searchCriteria);
    const brands = await Product.distinct("productBrand", searchCriteria);
    const genders = await Product.distinct("productGender", searchCriteria);
    const sizes = await Product.distinct("productSize", searchCriteria);

    res.json({
      categories,
      colors,
      brands,
      sizes,
      genders,
    });
  } catch (err) {
    console.error("Error fetching filter options:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching filter options: " + err.message });
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
    sortOrder = "",  // Default to an empty string if not specified
  } = req.query;

  console.log("Request query parameters:", req.query);

  try {
    const searchCriteria = {};

    // Apply search query if provided
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery, "i");
      searchCriteria.$or = [
        { productName: searchRegex },
        { productCategory: searchRegex },
        { productBrand: searchRegex },
        { productColor: searchRegex },
        { productGender: searchRegex },
      ];
    }

    // Add filter parameters
    if (category) {
      searchCriteria.productCategory = {
        $in: category.split(",").map((c) => c.trim()),
      };
    }
    if (color) {
      searchCriteria.productColor = { $regex: `^${color}$`, $options: "i" }; // Exact match for color
    }
    if (size) {
      searchCriteria.productSize = {
        $in: size.split(",").map((s) => s.trim()),
      };
    }
    if (brand) {
      searchCriteria.productBrand = { $regex: `^${brand}$`, $options: "i" }; // Exact match for brand
    }
    if (gender) {
      searchCriteria.productGender = { $regex: `^${gender}$`, $options: "i" }; // Exact match for gender
    }

    // Price filter handling (min and max price)
    if (price_min && price_max) {
      searchCriteria.productPrice = {
        $gte: parseFloat(price_min),
        $lte: parseFloat(price_max),
      };
    } else if (price_min) {
      searchCriteria.productPrice = { $gte: parseFloat(price_min) };
    } else if (price_max) {
      searchCriteria.productPrice = { $lte: parseFloat(price_max) };
    }

    // Sorting logic
    let sortCriteria = { productName: 1 };  // Default to alphabetic order

    if (sortOrder === "asc") {
      sortCriteria = { productPrice: 1 };  // Lowest price first
    } else if (sortOrder === "desc") {
      sortCriteria = { productPrice: -1 };  // Highest price first
    }

    // Fetch products based on search criteria and pagination
    const products = await Product.find(searchCriteria)
      .sort(sortCriteria)
      .skip((parseInt(page) - 1) * parseInt(limit))  // Parse page and limit to integers
      .limit(parseInt(limit));  // Ensure limit is an integer

    const totalProducts = await Product.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));  // Calculate total pages based on the limit

    console.log("Sorted products:", products);

    res.json({
      products,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};





// Function to get a product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  console.log("Received request for product ID:", id); // Log the ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err.message);
    res.status(500).json({ message: "Error fetching product by ID" });
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
    const formattedGenderProperCase =
      formattedGender.charAt(0).toUpperCase() + formattedGender.slice(1);

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
