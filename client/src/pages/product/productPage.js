import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Product from '../../components/product/product';  // Assuming Product is in this path
import ProductSearch from '../../components/productsearch/productsearch';

const ProductPage = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null); // Initialize product state
  const [selectedSize, setSelectedSize] = useState(''); // State for selected size

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id); // Debugging: Log the ID
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        console.log('Fetched product data:', response.data); // Debugging: Log the fetched data
        setProduct(response.data); // Set product data in state
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct(); // Fetch product when component mounts or ID changes
  }, [id]); 

  // Handle size selection change
  const handleSizeChange = (size) => {
    setSelectedSize(size); // Update the selected size
  };

  // Loading state while waiting for the product
  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      <ProductSearch />
      <Product 
        product={product} 
        selectedSize={selectedSize} 
        handleSizeChange={handleSizeChange} 
      />
    </div>
  );
};

export default ProductPage;
