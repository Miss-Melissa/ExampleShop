import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ProductUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productCategory: [],
    productColor: "",
    productBrand: "",
    productGender: "",
    productSize: [],
    productPrice: "",
    productDescription: "",
    productImages: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImages, setNewImages] = useState([]); 
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${id}`
        );
        const product = response.data;

        const productSize = Array.isArray(product.productSize)
          ? product.productSize
          : JSON.parse(product.productSize || "[]");
        const productCategory = Array.isArray(product.productCategory)
          ? product.productCategory
          : [product.productCategory];

        setFormData({
          productName: product.productName,
          productCategory: productCategory,
          productColor: product.productColor,
          productBrand: product.productBrand,
          productGender: product.productGender,
          productSize: productSize,
          productPrice: product.productPrice,
          productDescription: product.productDescription,
          productImages: product.productImages || [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to fetch product details");
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]); // Add new uploaded files to newImages
  };

  const handleRemoveImage = (image) => {
    if (newImages.includes(image)) {
      setNewImages(newImages.filter((img) => img !== image)); // Remove from newImages
    } else {
      setFormData((prev) => ({
        ...prev,
        productImages: prev.productImages.filter((img) => img !== image),
      }));
      setDeletedImages((prev) => [...prev, image]); // Mark image for deletion
    }
  };

  // Handling form submission (update product)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("productCategory", JSON.stringify(formData.productCategory));
    data.append("productSize", JSON.stringify(formData.productSize));
    data.append("productColor", formData.productColor);
    data.append("productBrand", formData.productBrand);
    data.append("productGender", formData.productGender);
    data.append("productPrice", formData.productPrice);
    data.append("productDescription", formData.productDescription);

    // Add all images (existing + new uploaded images)
    const finalProductImages = [...formData.productImages, ...newImages];
    finalProductImages.forEach((image) => {
      data.append("productImages", image);
    });

    // Add images to be deleted
    data.append("deletedImages", JSON.stringify(deletedImages));

    try {
      const response = await axios.put(
        `http://localhost:5000/products/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Product updated successfully");
      navigate("/products");
    } catch (err) {
      console.error(
        "Error updating product:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to update product");
    }
  };

  // Loading or error state handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={formData.productName}
            onChange={handleInputChange}
            name="productName"
          />
        </div>

        {/* Product Category */}
        <div>
          <label>Product Categories:</label>
          <div>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (
                  newCategory &&
                  !formData.productCategory.includes(newCategory)
                ) {
                  setFormData((prev) => ({
                    ...prev,
                    productCategory: [...prev.productCategory, newCategory],
                  }));
                  setNewCategory("");
                }
              }}
            >
              Add Category
            </button>
          </div>
          <ul>
            {formData.productCategory.map((category, index) => (
              <li key={index}>
                {category}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      productCategory: prev.productCategory.filter(
                        (cat) => cat !== category
                      ),
                    }))
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Color */}
        <div>
          <label>Product Color:</label>
          <input
            type="text"
            value={formData.productColor}
            onChange={handleInputChange}
            name="productColor"
          />
        </div>

        {/* Product Brand */}
        <div>
          <label>Product Brand:</label>
          <input
            type="text"
            value={formData.productBrand}
            onChange={handleInputChange}
            name="productBrand"
          />
        </div>

        {/* Product Gender */}
        <div>
          <label>Product Gender:</label>
          <select
            value={formData.productGender}
            onChange={handleInputChange}
            name="productGender"
          >
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Product Sizes */}
        <div>
          <label>Product Sizes:</label>
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              if (newSize && !formData.productSize.includes(newSize)) {
                setFormData((prev) => ({
                  ...prev,
                  productSize: [...prev.productSize, newSize],
                }));
                setNewSize("");
              }
            }}
          >
            Add Size
          </button>
          <ul>
            {formData.productSize.map((size, index) => (
              <li key={index}>
                {size}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      productSize: prev.productSize.filter((s) => s !== size),
                    }))
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Price */}
        <div>
          <label>Product Price:</label>
          <input
            type="number"
            value={formData.productPrice}
            onChange={handleInputChange}
            name="productPrice"
          />
        </div>

        {/* Product Description */}
        <div>
          <label>Product Description:</label>
          <textarea
            value={formData.productDescription}
            onChange={handleInputChange}
            name="productDescription"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label>Upload Images:</label>
          <input type="file" multiple onChange={handleImageChange} />
        </div>

        {/* Existing Images */}
        <div>
          <h4>Existing Images:</h4>
          {formData.productImages && formData.productImages.length > 0 ? (
            formData.productImages.map((image, index) => (
              <div key={index}>
                {/* Assuming 'image' is a filename, prepend the correct URL path */}
                <img
                  src={`http://localhost:5000/uploads/${image}`}
                  alt={`Product Image ${index + 1}`}
                  width={100}
                />
                <button type="button" onClick={() => handleRemoveImage(image)}>
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        {/* New Images: Only show if there are new images */}
        {newImages.length > 0 && (
          <div>
            <h4>New Images:</h4>
            {newImages.map((image, index) => (
              <div key={index}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New Image ${index + 1}`}
                  width={100}
                />
                <button type="button" onClick={() => handleRemoveImage(image)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default ProductUpdatePage;
