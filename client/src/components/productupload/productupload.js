import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductUpload = () => {
  const [productName, setProductName] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productSize, setProductSize] = useState([]);
  const [productGender, setProductGender] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [productBrand, setProductBrand] = useState("");
  const [productColor, setProductColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [productList, setProductList] = useState([]);  // Initialized as an empty array

  // Fetch the product list initially when the page loads
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        if (response.ok) {
          const products = await response.json();
          setProductList(Array.isArray(products) ? products : []); // Ensure it's an array
        } else {
          console.error("Failed to fetch product list");
          setProductList([]); // Fallback to an empty array in case of error
        }
      } catch (error) {
        console.error("Error fetching product list:", error);
        setProductList([]); // Fallback to an empty array in case of error
      }
    };

    fetchProductList();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value, files } = e.target;

    if (name === "productImages") {
      const updatedImages = [...productImages];
      const updatedPreviews = [...imagePreviews];
      updatedImages[index] = files[0];
      updatedPreviews[index] = URL.createObjectURL(files[0]);
      setProductImages(updatedImages);
      setImagePreviews(updatedPreviews);
    } else if (name === "sizeInput") {
      setSizeInput(value);
    } else if (name === "categoryInput") {
      setCategoryInput(value);
    } else {
      const stateMap = {
        productName: setProductName,
        productPrice: setProductPrice,
        productDescription: setProductDescription,
        productQuantity: setProductQuantity,
        productGender: setProductGender,
        productBrand: setProductBrand,
        productColor: setProductColor,
      };
      if (stateMap[name]) {
        stateMap[name](value);
      }
    }
  };

  const handleAddSize = () => {
    if (sizeInput && !productSize.includes(sizeInput)) {
      setProductSize([...productSize, sizeInput]);
      setSizeInput("");
    }
  };

  const handleRemoveSize = (size) => {
    setProductSize(productSize.filter((item) => item !== size));
  };

  const handleAddCategory = () => {
    if (categoryInput && !productCategories.includes(categoryInput)) {
      setProductCategories([...productCategories, categoryInput]);
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (category) => {
    setProductCategories(productCategories.filter((item) => item !== category));
  };

  const handleAddImage = () => {
    setProductImages([...productImages, null]);
    setImagePreviews([...imagePreviews, ""]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...productImages];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setProductImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that the productGender is properly capitalized
    const formattedGender =
      productGender.charAt(0).toUpperCase() + productGender.slice(1).toLowerCase();

    // Validate all fields before submitting
    if (
      !productName ||
      !productPrice ||
      !productDescription ||
      !productQuantity ||
      !formattedGender || // Use the formattedGender here
      !productBrand ||
      !productColor ||
      !productCategories.length ||
      !productImages.length
    ) {
      console.error("All fields are required");
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();

      // Append text fields
      formData.append("productName", productName);
      formData.append("productPrice", productPrice);
      formData.append("productDescription", productDescription);
      formData.append("productQuantity", productQuantity);
      formData.append("productGender", formattedGender); // Use the formattedGender here
      formData.append("productBrand", productBrand);
      formData.append("productColor", productColor);

      // Append categories (array of strings)
      productCategories.forEach((category) => formData.append("productCategory", category));

      // Append sizes (array of strings)
      productSize.forEach((size) => formData.append("productSize", size));

      // Append images
      Array.from(productImages).forEach((image) => formData.append("productImages", image));

      // Debugging: Log FormData content
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Make the POST request
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Product uploaded successfully:", result);
        alert("Product uploaded successfully!");

        // Update product list immediately with the new product
        setProductList((prevList) => [...prevList, result]);
      } else {
        const error = await response.json();
        console.error("Error uploading product:", error);
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error("Error submitting the form:", err);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload New Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Categories */}
        <div>
          <label>Categories:</label>
          <input
            type="text"
            name="categoryInput"
            value={categoryInput}
            onChange={handleInputChange}
            placeholder="Enter category"
          />
          <button type="button" onClick={handleAddCategory}>
            Add Category
          </button>
          <ul>
            {productCategories.map((category, index) => (
              <li key={index}>
                {category}{" "}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Price */}
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="productPrice"
            value={productPrice}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        {/* Description */}
        <div>
          <label>Description:</label>
          <textarea
            name="productDescription"
            value={productDescription}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="productQuantity"
            value={productQuantity}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        {/* Sizes */}
        <div>
          <label>Sizes:</label>
          <input
            type="text"
            name="sizeInput"
            value={sizeInput}
            onChange={handleInputChange}
            placeholder="Enter size"
          />
          <button type="button" onClick={handleAddSize}>
            Add Size
          </button>
          <ul>
            {productSize.map((size, index) => (
              <li key={index}>
                {size}{" "}
                <button type="button" onClick={() => handleRemoveSize(size)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Gender */}
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="productGender"
            value={productGender}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label>Brand:</label>
          <input
            type="text"
            name="productBrand"
            value={productBrand}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Color */}
        <div>
          <label>Color:</label>
          <input
            type="text"
            name="productColor"
            value={productColor}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Images */}
        <div>
          <label>Images:</label>
          <button type="button" onClick={handleAddImage}>
            Add Image
          </button>
          {productImages.map((image, index) => (
            <div key={index}>
              <input
                type="file"
                name="productImages"
                onChange={(e) => handleInputChange(e, index)}
                required
              />
              {imagePreviews[index] && (
                <img src={imagePreviews[index]} alt="Preview" width="100" />
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductUpload;
