import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});

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
      // Only allow one size to be selected at a time for each product
      updatedSizes[productId] = updatedSizes[productId] === size ? null : size;
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

            {product.productSize && Array.isArray(product.productSize) && product.productSize.length > 0 && (
              <div>
                <h4>Available Sizes:</h4>
                {product.productSize.map((size) => (
                  <label key={size} style={{ marginRight: "10px" }}>
                    <input
                      type="checkbox"
                      checked={selectedSizes[product._id] === size}
                      onChange={() => handleSizeChange(product._id, size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
