import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BuyBtn from "../buybtn/buybtn";
import ProductFilter from "../productfilter/productfilter";

const Products = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/products", {
          params: {
            page,
            limit,
            query: searchQuery,
            ...debouncedFilters,
          },
        });
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchQuery, debouncedFilters, limit]);

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

  if (loading) return <p>Loading products...</p>;

  return (
    <div>

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