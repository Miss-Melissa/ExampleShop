// src/components/Products.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products when the component is mounted
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Send GET request to your backend to fetch the products
        const response = await axios.get('http://localhost:5000/products');  // Replace with your actual backend URL
        setProducts(response.data); // Update the state with fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product List</h1>

      {/* Display list of products */}
      <div>
        {products.length === 0 ? (
          <p>No products available.</p>  // If there are no products, show this message
        ) : (
          products.map((product) => (
            <div key={product._id}>
              <h3>{product.productName}</h3>
              <p>Price: {product.productPrice} SEK</p>
              <p>Description: {product.productDescription}</p>
              <p>Quantity: {product.productQuantity}</p>
              <img src={product.productImage} alt={product.productName} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
