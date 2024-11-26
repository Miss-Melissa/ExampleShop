import React, { useState } from "react";
import axios from "axios";

const ProductUpload = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
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
    } else {
      const stateMap = {
        productName: setProductName,
        productCategory: setProductCategory,
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

  const handleAddImage = () => {
    setProductImages([...productImages, null]);
    setImagePreviews([...imagePreviews, ""]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...productImages];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1); // Remove image at index
    updatedPreviews.splice(index, 1); // Remove preview at index
    setProductImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !productName ||
      !productCategory ||
      !productPrice ||
      !productDescription ||
      !productQuantity ||
      !productBrand ||
      !productColor ||
      !productGender ||
      !productSize.length ||
      !productImages.length
    ) {
      setLoading(false);
      setError("All fields are required.");
      return;
    }

    if (parseFloat(productPrice) <= 0 || parseInt(productQuantity, 10) <= 0) {
      setLoading(false);
      setError("Price and quantity must be greater than zero.");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productCategory", productCategory);
    formData.append("productPrice", parseFloat(productPrice));
    formData.append("productDescription", productDescription);
    formData.append("productQuantity", parseInt(productQuantity, 10));
    formData.append("productSize", JSON.stringify(productSize));
    formData.append("productGender", productGender);
    formData.append("productBrand", productBrand);
    formData.append("productColor", productColor);

    productImages.forEach((image) => {
      if (image) {
        formData.append("productImages", image);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/products",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Product uploaded successfully:", response.data);

      setProductName("");
      setProductCategory("");
      setProductPrice("");
      setProductDescription("");
      setProductQuantity("");
      setProductSize([]);
      setProductGender("");
      setProductBrand("");
      setProductColor("");
      setProductImages([]);
      setImagePreviews([]);
      setLoading(false);
    } catch (err) {
      console.error("Error uploading product:", err);
      setError(err.response?.data?.message || "Error uploading product.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload New Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="productCategory"
            value={productCategory}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="productPrice"
            value={productPrice}
            onChange={handleInputChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="productDescription"
            value={productDescription}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="productQuantity"
            value={productQuantity}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>
        <div>
          <label>Sizes:</label>
          <input
            type="text"
            name="sizeInput"
            value={sizeInput}
            onChange={handleInputChange}
            placeholder="Enter size (e.g., S, M, L)"
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
        <div>
          <label>Gender:</label>
          <select
            name="productGender"
            value={productGender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
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
        <div>
          <label>Product Images:</label>
          {productImages.map((_, index) => (
            <div key={index}>
              <input
                type="file"
                name="productImages"
                onChange={(e) => handleInputChange(e, index)}
                accept="image/*"
              />
              {imagePreviews[index] && (
                <img
                  src={imagePreviews[index]}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "100px", height: "auto" }}
                />
              )}
              <button type="button" onClick={() => handleRemoveImage(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddImage}>
            Add Image
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductUpload;
