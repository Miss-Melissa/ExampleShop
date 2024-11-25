import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Product from '../../components/product/product';  // Assuming Product is in this path

const ProductPage = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null); // Initialize product state
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    if (!id) {
      console.error('Product ID is missing or undefined');
      setError('Product ID is missing');
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id); // Debugging: Log the ID
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        console.log('Fetched product data:', response.data); // Debugging: Log the fetched data
        setProduct(response.data); // Set product data in state
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again later.'); // Set error message
      } finally {
        setLoading(false); // Stop loading when data is fetched or error occurs
      }
    };

    fetchProduct(); // Fetch product when component mounts or ID changes
  }, [id]); 

  // Handle loading state
  if (loading) {
    return <p>Loading product details...</p>;
  }

  // Handle error state
  if (error) {
    return <p>{error}</p>;
  }

  // If product data exists, display it using the Product component
  return (
    <div>
      <Product product={product} />
    </div>
  );
};

export default ProductPage;
