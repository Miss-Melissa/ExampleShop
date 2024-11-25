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

  const handleBuyClick = () => {
    alert("Product added to cart!");
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
            <div
              key={
                product._id || `${product.productName}-${product.productPrice}` // Use a fallback unique key if _id is missing
              }
            >
              <Link to={`/products/${product._id}`}>
                <h3>{product.productName}</h3>
                <img
                  src={product.productImage}
                  alt={product.productName}
                  height={200}
                />
                <p>Price: ${product.productPrice}</p>
                <BuyBtn onClick={handleBuyClick} />
              </Link>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}

        {/* Pagination Controls */}
        <div>
          {page > 1 && ( // Only render the Previous button if the page is greater than 1
            <button onClick={() => handlePageChange(page - 1)}>Previous Page</button>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && ( // Only render the Next button if the page is less than the total pages
            <button onClick={() => handlePageChange(page + 1)}>Next Page</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
