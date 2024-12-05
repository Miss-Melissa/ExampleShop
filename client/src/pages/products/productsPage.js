import React, { useState, useEffect } from "react";
import axios from "axios";
import Products from "../../components/products/products";
import ProductSearch from "../../components/productsearch/productsearch";
import ProductFilter from "../../components/productfilter/productfilter";

const ProductsPage = () => {
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

  // Handle changes in filter inputs (category, color, etc.)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle search query change from ProductSearch component
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query state
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
            searchQuery,
            ...debouncedFilters,
          },
        });

        if (response.data.products) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Products Page</h1>

      {/* ProductSearch component to handle user search */}
      <ProductSearch onSearch={handleSearch} />

      {/* ProductFilter component */}
      <ProductFilter filters={filters} handleFilterChange={handleFilterChange} />

      <Products
        products={products}
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductsPage;
