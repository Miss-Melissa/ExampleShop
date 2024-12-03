import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BuyBtn from "../buybtn/buybtn";
import ProductFilter from "../productfilter/productfilter";
import ProductSearch from "../productsearch/productsearch";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
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
  const [selectedSizes, setSelectedSizes] = useState({});

  // Handle changes in filter inputs (category, color, etc.)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Debounce filters before sending to the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // Debounce delay of 500ms
    return () => clearTimeout(timer);
  }, [filters]);

  // Fetch products when filters, page, or search query changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/products/search", {
          params: {
            page,
            limit,
            searchQuery, // Pass search query
            ...debouncedFilters, // Pass filters
          },
        });

        // Set products and total pages from the response
        if (response.data.products) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
          console.log("Filters applied:", { page, limit, searchQuery, ...debouncedFilters });
console.log("Response data:", response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if search query or filters are set
    if (searchQuery || Object.values(debouncedFilters).some((val) => val)) {
      fetchProducts();
    }
  }, [page, searchQuery, debouncedFilters, limit]); // Trigger when filters, searchQuery, or page changes

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  const handleBuyClick = (productId) => {
    alert(`Product ${productId} added to cart!`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle search query change from ProductSearch component
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query state
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      {/* ProductSearch component to handle user search */}
      <ProductSearch onSearch={handleSearch} />

      {/* ProductFilter component */}
      <ProductFilter filters={filters} handleFilterChange={handleFilterChange} />

      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id || `${product.productName}-${product.productPrice}`}>
              <Link to={`/products/${product._id}`}>
                <h3>{product.productName}</h3>

                {/* Render multiple images if available */}
                {product.productImages && product.productImages.length > 0 ? (
                  <div>
                    {product.productImages.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/uploads/${image}`}
                        alt={`${product.productName} image ${index + 1}`}
                        style={{ width: "200px", margin: "10px" }} // Adjust styling as needed
                      />
                    ))}
                  </div>
                ) : (
                  <p>No images available</p>
                )}

                <p>Price: ${product.productPrice}</p>
              </Link>

              {/* Handle size selection */}
              {product.productSize && product.productSize.length > 0 ? (
                <div>
                  <h4>Available Sizes:</h4>
                  <select
                    value={selectedSizes[product._id] || ""}
                    onChange={(e) => handleSizeChange(product._id, e.target.value)}
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
                <p>No sizes available</p>
              )}

              <BuyBtn onClick={() => handleBuyClick(product._id)} />
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}

        <div>
          {/* Pagination Controls */}
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
