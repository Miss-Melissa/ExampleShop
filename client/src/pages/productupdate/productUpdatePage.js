import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    productCategory: [], // Ensure productCategory is an array
    productColor: '',
    productBrand: '',
    productGender: '',
    productSize: [], // Ensuring productSize is an array
    productPrice: '',
    productDescription: '',
    productImages: [], // Added images array to store images fetched from the backend
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newCategory, setNewCategory] = useState(''); // State for new category
  const [newImages, setNewImages] = useState([]); // For storing new images
  const [deletedImages, setDeletedImages] = useState([]); // For storing deleted images

  // Fetch product data when the component is mounted
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        const product = response.data;

        const productSize = Array.isArray(product.productSize)
          ? product.productSize
          : JSON.parse(product.productSize || '[]');

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

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory && !formData.productCategory.includes(newCategory)) {
      setFormData((prev) => ({
        ...prev,
        productCategory: [...prev.productCategory, newCategory],
      }));
      setNewCategory(''); // Clear the input field after adding
    }
  };

  // Handle removing a category
  const handleRemoveCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      productCategory: prev.productCategory.filter((cat) => cat !== category),
    }));
  };

  // Handle adding a new size
  const handleAddSize = () => {
    if (newSize && !formData.productSize.includes(newSize)) {
      setFormData((prev) => ({
        ...prev,
        productSize: [...prev.productSize, newSize],
      }));
      setNewSize('');
    }
  };

  // Handle removing a size
  const handleRemoveSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      productSize: prev.productSize.filter((s) => s !== size),
    }));
  };

  // Handle image changes (for new images)
  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  // Handle image removal (mark for deletion)
  const handleRemoveImage = (image) => {
    setDeletedImages((prev) => [...prev, image]);
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((img) => img !== image),
    }));
  };

// Ensure `productCategory` and `productSize` are arrays before submission
const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('productName', formData.productName);
  
    // Ensure productCategory is an array
    let productCategory = formData.productCategory;
    if (typeof productCategory === 'string') {
      try {
        productCategory = JSON.parse(productCategory); // Parse the string into an actual array
      } catch (err) {
        console.error('Error parsing productCategory:', err);
        return; // Exit if parsing fails
      }
    }
  
    // Ensure productSize is also an array
    let productSize = formData.productSize;
    if (typeof productSize === 'string') {
      try {
        productSize = JSON.parse(productSize); // Parse the string into an actual array
      } catch (err) {
        console.error('Error parsing productSize:', err);
        return; // Exit if parsing fails
      }
    }
  
    // Append the parsed arrays to FormData
    data.append('productCategory', JSON.stringify(productCategory)); // Send as JSON string to preserve array structure
    data.append('productSize', JSON.stringify(productSize)); // Send as JSON string to preserve array structure
  
    // Other fields
    data.append('productColor', formData.productColor);
    data.append('productBrand', formData.productBrand);
    data.append('productGender', formData.productGender);
    data.append('productPrice', formData.productPrice);
    data.append('productDescription', formData.productDescription);
  
    // Handle images
    for (let i = 0; i < newImages.length; i++) {
      data.append('productImages', newImages[i]);
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product updated successfully');
      navigate('/products');
    } catch (err) {
      console.error('Error updating product:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };
  
  
  
  

  // Loading and error handling
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
            <button type="button" onClick={handleAddCategory}>Add Category</button>
          </div>
          <ul>
            {formData.productCategory.map((category, index) => (
              <li key={index}>
                {category}{' '}
                <button type="button" onClick={() => handleRemoveCategory(category)}>Remove</button>
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
          <div>
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
            />
            <button type="button" onClick={handleAddSize}>Add Size</button>
          </div>
          <ul>
            {formData.productSize.map((size, index) => (
              <li key={index}>
                {size}{' '}
                <button type="button" onClick={() => handleRemoveSize(size)}>Remove</button>
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

        {/* Product Images */}
        <div>
          <label>Product Images:</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
          />
          <div>
            {formData.productImages && formData.productImages.length > 0 && (
              <ul>
                {formData.productImages.map((image, index) => (
                  <li key={index}>
                    <img src={image} alt={`product-image-${index}`} width={100} />
                    <button type="button" onClick={() => handleRemoveImage(image)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button type="submit">Update Product</button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpdatePage;
