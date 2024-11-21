import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BuyBtn from '../buybtn/buybtn';

const Products = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products based on search query

  useEffect(() => {
    // Function to fetch products
    const fetchProducts = async () => {
      try {
        setLoading(true); // Show loading spinner while fetching
        const response = await axios.get('http://localhost:5000/products/');
        console.log("Fetched product data:", response.data);

        setProducts(response.data); // Save fetched products
        setFilteredProducts(response.data); // Set all products initially
        setLoading(false); // Stop loading spinner
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
        setLoading(false); // Stop loading spinner even if there is an error
      }
    };

    fetchProducts();
  }, []); // Fetch products only once when the component mounts

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products); // If no search query, show all products
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = products.filter((product) => {
        const productName = product.productName ? product.productName.toLowerCase() : '';
        const productCategory = product.productCategory ? product.productCategory.toLowerCase() : '';
        return (
          productName.includes(lowercasedQuery) ||
          productCategory.includes(lowercasedQuery)
        );
      });
      setFilteredProducts(filtered); // Update the filtered list
    }
  }, [searchQuery, products]); // Re-filter products when searchQuery or products change

  const handleBuyClick = () => {
    alert('Product added to cart!');
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      {error && <p>{error}</p>}

      <div>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
          <p>No products match your search.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
