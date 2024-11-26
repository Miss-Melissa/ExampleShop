import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductUpdatePage() {
  const { id } = useParams(); // Get the product ID from the URL params
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);  // For new image uploads
  const [deletedImages, setDeletedImages] = useState([]);  // For images to be deleted
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    productColor: '',
    productBrand: '',
    productGender: '',
    productSize: [],  
    productPrice: 0,
    productDescription: '',
  });

  const [newSize, setNewSize] = useState(''); // For adding new size

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(response.data);
        setFormData({
          productName: response.data.productName,
          productCategory: response.data.productCategory,
          productColor: response.data.productColor,
          productBrand: response.data.productBrand,
          productGender: response.data.productGender,
          productSize: response.data.productSize,
          productPrice: response.data.productPrice,
          productDescription: response.data.productDescription,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle size input change
  const handleSizeInputChange = (e) => {
    setNewSize(e.target.value);
  };

  // Handle adding a size
  const handleAddSize = () => {
    if (newSize && !formData.productSize.includes(newSize)) {
      setFormData((prev) => ({
        ...prev,
        productSize: [...prev.productSize, newSize],
      }));
      setNewSize(''); // Clear the input field after adding
    }
  };

  // Handle removing a size
  const handleRemoveSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      productSize: prev.productSize.filter((s) => s !== size),
    }));
  };

  // Handle image input changes (for new images)
  const handleImageChange = (e) => {
    setNewImages(e.target.files);  // Store new images
  };

  // Handle removing an image (mark for deletion)
  const handleRemoveImage = (image) => {
    setDeletedImages((prev) => [...prev, image]);  // Add image to deleted list
    setProduct((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((img) => img !== image),  // Remove image from UI
    }));
  };

  // Submit the form to update the product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('productCategory', formData.productCategory);
    data.append('productColor', formData.productColor);
    data.append('productBrand', formData.productBrand);
    data.append('productGender', formData.productGender);
    data.append('productSize', JSON.stringify(formData.productSize));
    data.append('productPrice', formData.productPrice);
    data.append('productDescription', formData.productDescription);

    // Append new images to the form data
    for (let i = 0; i < newImages.length; i++) {
      data.append('productImages', newImages[i]);
    }

    // Send the deleted images list
    data.append('deletedImages', JSON.stringify(deletedImages));

    try {
      const response = await axios.put(`http://localhost:5000/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product updated successfully');
      navigate('/products');  // Redirect to product list after update
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Update Product</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
          />
        </div>

        {/* Product Category */}
        <div>
          <label>Category</label>
          <input
            type="text"
            name="productCategory"
            value={formData.productCategory}
            onChange={handleInputChange}
          />
        </div>

        {/* Product Color */}
        <div>
          <label>Color</label>
          <input
            type="text"
            name="productColor"
            value={formData.productColor}
            onChange={handleInputChange}
          />
        </div>

        {/* Product Brand */}
        <div>
          <label>Brand</label>
          <input
            type="text"
            name="productBrand"
            value={formData.productBrand}
            onChange={handleInputChange}
          />
        </div>

        {/* Product Gender */}
        <div>
          <label>Gender</label>
          <select
            name="productGender"
            value={formData.productGender}
            onChange={handleInputChange}
          >
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Product Size */}
        <div>
          <label>Product Size</label>
          <input
            type="text"
            value={newSize}
            onChange={handleSizeInputChange}
            placeholder="Enter size (e.g., s, m, l)"
          />
          <button type="button" onClick={handleAddSize}>
            Add Size
          </button>
        </div>

        {/* Sizes list */}
        <div>
          <h4>Current Sizes</h4>
          {formData.productSize.length > 0 ? (
            formData.productSize.map((size) => (
              <span key={size}>
                {size}
                <button type="button" onClick={() => handleRemoveSize(size)}>
                  Remove
                </button>
              </span>
            ))
          ) : (
            <p>No sizes added</p>
          )}
        </div>

        {/* Upload New Images */}
        <div>
          <label>Upload New Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
          />
        </div>

        {/* Existing images */}
        <h3>Current Images</h3>
        <div>
          {product.productImages.map((image, index) => (
            <div key={index}>
              <img
                src={`http://localhost:5000/uploads/${image}`}
                alt={`Product Image ${index + 1}`}
                width="100"
                height="100"
              />
              <button onClick={() => handleRemoveImage(image)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit">Update Product</button>
        </div>
      </form>
    </div>
  );
}

export default ProductUpdatePage;
