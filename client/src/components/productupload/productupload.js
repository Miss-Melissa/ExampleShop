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

  // Handle input changes for various fields
  const handleInputChange = (e, index) => {
    const { name, value, files } = e.target;

    if (name === "productImages") {
      const newProductImages = [...productImages];
      const newImagePreviews = [...imagePreviews];
      newProductImages[index] = files[0];
      newImagePreviews[index] = URL.createObjectURL(files[0]);
      setProductImages(newProductImages);
      setImagePreviews(newImagePreviews);
    } else if (name === "sizeInput") {
      setSizeInput(value);
    } else {
      switch (name) {
        case "productName":
          setProductName(value);
          break;
        case "productCategory":
          setProductCategory(value);
          break;
        case "productPrice":
          setProductPrice(value);
          break;
        case "productDescription":
          setProductDescription(value);
          break;
        case "productQuantity":
          setProductQuantity(value);
          break;
        case "productGender":
          setProductGender(value);
          break;
        case "productBrand":
          setProductBrand(value);
          break;
        case "productColor":
          setProductColor(value);
          break;
        default:
          break;
      }
    }
  };

  // Add size to the product size array
  const handleAddSize = () => {
    if (sizeInput && !productSize.includes(sizeInput)) {
      setProductSize([...productSize, sizeInput]);
      setSizeInput("");
    }
  };

  // Remove a size from the size array
  const handleRemoveSize = (size) => {
    setProductSize(productSize.filter((item) => item !== size));
  };

  // Add new image input field
  const handleAddImage = () => {
    setProductImages([...productImages, null]);
    setImagePreviews([...imagePreviews, ""]);
  };

  // Remove image input field
  const handleRemoveImage = (index) => {
    setProductImages(productImages.filter((_, idx) => idx !== index));
    setImagePreviews(imagePreviews.filter((_, idx) => idx !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error before submission

    // Validate that the necessary fields are filled in
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
      !productImages.length // Check that there are images selected
    ) {
      setLoading(false);
      setError("All fields are required.");
      return;
    }

    if (parseFloat(productPrice) <= 0 || parseInt(productQuantity) <= 0) {
      setLoading(false);
      setError("Price and quantity must be greater than zero.");
      return;
    }

    // Create FormData to send to the backend
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productCategory", productCategory);
    formData.append("productPrice", parseFloat(productPrice)); // Ensure price is a number
    formData.append("productDescription", productDescription);
    formData.append("productQuantity", parseInt(productQuantity)); // Ensure quantity is a number
    formData.append("productSize", JSON.stringify(productSize)); // Convert array to string for storage
    formData.append("productGender", productGender);
    formData.append("productBrand", productBrand); // Append productBrand
    formData.append("productColor", productColor); // Append productColor

    // Log the formData to see its content
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // This will log each key-value pair in the FormData
    }

    // Append multiple images to FormData
    productImages.forEach((image) => {
      if (image) {
        formData.append("productImages", image); // Append each image
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/products",  // Ensure this URL is correct
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      console.log("Product uploaded successfully:", response.data);

      // Reset form after successful upload
      setProductName("");
      setProductCategory("");
      setProductPrice("");
      setProductDescription("");
      setProductQuantity("");
      setProductSize([]);
      setProductGender("");
      setProductBrand(""); // Reset productBrand
      setProductColor(""); // Reset productColor
      setProductImages([]); // Reset images
      setImagePreviews([]); // Reset image previews
      setLoading(false);
    } catch (err) {
      console.error("Error uploading product:", err);
      if (err.response) {
        console.error("Response data:", err.response.data); // Log the error response from the server
        setError(`Error uploading product: ${err.response.data.message || err.response.data}`);
      } else {
        setError("Error uploading product.");
      }
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
          <div>
            <input
              type="text"
              name="sizeInput"
              value={sizeInput}
              onChange={handleInputChange}
              placeholder="Enter size (e.g. S, M, L)"
            />
            <button
              type="button"
              onClick={handleAddSize}
              disabled={!sizeInput}
            >
              Add Size
            </button>
          </div>
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
            <option value="select">Select</option>
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
                <div>
                  <img
                    src={imagePreviews[index]}
                    alt={`Preview ${index + 1}`} // Removed "image" from alt text
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={productImages.length === 1}
              >
                Remove Image
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
