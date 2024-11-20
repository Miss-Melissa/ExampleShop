import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch product data from the backend
        const response = await axios.get('http://localhost:5000/products/');
        console.log("Fetched product data:", response.data);  // Log the response data
        
        if (response.data && response.data.length) {
          setProducts(response.data);
        } else {
          console.log("No products found.");
          setError("No products found.");
        }
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products'); // Set error message
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>; // Loading state message
  }

  return (
    <div>
      <h1>Product List</h1>

      {error && <p>{error}</p>}

      <div>
        {products.length === 0 ? (
          <p>No products available.</p> // If there are no products, show this message
        ) : (
          products.map((product) => (
            <div key={product._id}>
              <Link to={`/products/${product._id}`}>
                <h3>{product.productName}</h3>
                <img src={product.productImage} alt={product.productName} height={200} />
                <p>Price: {product.productPrice} SEK</p>
                <p>Description: {product.productDescription}</p>
                <p>Quantity: {product.productQuantity}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
