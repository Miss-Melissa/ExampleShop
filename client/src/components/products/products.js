import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BuyBtn from "../buybtn/buybtn";
import ProductFilter from "../productfilter/productfilter";

const Products = ({ searchQuery }) => {
  const [products, setProducts] = useState([]); // All fetched products
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [limit] = useState(10); // Number of products per page
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    brand: "",
    gender: "",
    size: "",
    price_min: 0,
    price_max: 1000,
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // State for storing selected size for each product
  const [selectedSizes, setSelectedSizes] = useState({});

  // Update the filters immediately on input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Set a debounce function to update the filters after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters); // Update debouncedFilters only after typing stops
    }, 500); // Adjust the time for debounce (500ms)

    return () => {
      clearTimeout(timer); // Clear timeout if the user types again
    };
  }, [filters]);

  // Fetch products based on filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/products", {
          params: {
            page,
            limit,
            query: searchQuery,
            ...debouncedFilters, // Send debounced filters to the backend
          },
        });

        setProducts(response.data.products); // Save fetched products
        setTotalPages(response.data.totalPages); // Set total pages for pagination
      } catch (error) {
        console.error("Error fetching products:", error); // Log error to console, but don't display
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // Fetch products when dependencies change
  }, [page, searchQuery, debouncedFilters, limit]);

  // Handle size change for a specific product
  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size, // Update selected size for the specific product
    }));
  };

  const handleBuyClick = (productId) => {
    alert(`Product ${productId} added to cart!`);
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Render the UI
  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      {/* Use the Filter component */}
      <ProductFilter
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id || `${product.productName}-${product.productPrice}`}>
              <Link to={`/products/${product._id}`}>
                <h3>{product.productName}</h3>
                {/* Display the product image */}
                <img
                  src={`http://localhost:5000/uploads/${product.productImage}`} // Image path
                  alt={product.productName}
                  height={200}
                />
                <p>Price: ${product.productPrice}</p>
              </Link>

              {/* Dropdown for sizes if available */}
              {product.productSize && product.productSize.length > 0 ? (
                <div>
                  <h4>Available Sizes:</h4>
                  <select
                    value={selectedSizes[product._id] || ""}
                    onChange={(e) => handleSizeChange(product._id, e.target.value)} // Handling size change
                  >
                    <option value="">Select a size</option>
                    {product.productSize.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p>No sizes available</p> // Message if no sizes are available
              )}
                              <BuyBtn onClick={() => handleBuyClick(product._id)} />

            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}

        {/* Pagination Controls */}
        <div>
          {page > 1 && (
            <button onClick={() => handlePageChange(page - 1)}>Previous Page</button>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <button onClick={() => handlePageChange(page + 1)}>Next Page</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
