import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BuyBtn from '../buybtn/buybtn';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({}); // To track selected sizes per product


  const handleBuyClick = () => {
    alert('Product added to cart!');
    console.log(handleBuyClick);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products/');
        console.log("Fetched product data:", response.data);

        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        } else {
          setError("No products found.");
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prevState => {
      const updatedSizes = { ...prevState };
      updatedSizes[productId] = size; // Update the selected size for the product
      return updatedSizes;
    });
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Product List</h1>

      {error && <p>{error}</p>}

      <div>
        {products.map((product) => (
          <div key={product._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <Link to={`/products/${product._id}`}>
              <h3>{product.productName}</h3>
              <img src={product.productImage} alt={product.productName} height={200} />
              <p>Price: {product.productPrice} SEK</p>
              <p>Description: {product.productDescription}</p>
              <p>Quantity: {product.productQuantity}</p>
            </Link>

            <BuyBtn onClick={handleBuyClick} buttonText="Add to Cart" />

            {/* Only show the size dropdown if the product has sizes */}
            {product.productSize && product.productSize.length > 0 && (
              <div>
                <h4>Available Sizes:</h4>
                <select
                  value={selectedSizes[product._id] || ''}
                  onChange={(e) => handleSizeChange(product._id, e.target.value)}
                  style={{ padding: '5px', margin: '10px 0' }}
                >
                  <option value="">Select a size</option>
                  {product.productSize.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
