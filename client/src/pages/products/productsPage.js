import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductSearch from "../../components/productsearch/productsearch";
import ProductFilter from "../../components/productfilter/productfilter";
import Products from "../../components/products/products";

const ProductPage = () => {
  const [products, setProducts] = useState([]); // Store fetched products
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [page, setPage] = useState(1); // Current page
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    size: "",
    brand: "",
    gender: "",
    price_min: 0,
    price_max: 1000,
  }); // Current filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search query

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        searchQuery,
        category: filters.category,
        color: filters.color,
        size: filters.size,
        brand: filters.brand,
        gender: filters.gender,
        price_min: filters.price_min,
        price_max: filters.price_max,
      });

      const response = await axios.get(
        `http://localhost:5000/products/search?${queryParams.toString()}`
      );

      setProducts(response.data.products); // Update the products
      setTotalPages(response.data.totalPages); // Update total pages
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch products whenever filters, search query, or page changes
  useEffect(() => {
    fetchProducts();
  }, [filters, searchQuery, page]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPage(1); // Reset to the first page on filter change
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle search query change
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to the first page on search
  };

  // Clear search and reset filters
  const handleClearSearch = () => {
    setSearchQuery(""); // Clear search query
    setFilters({ // Reset all filters to their default values
      category: "",
      color: "",
      size: "",
      brand: "",
      gender: "",
      price_min: 0,
      price_max: 1000,
    });
    setPage(1); // Reset to the first page
  };

  return (
    <div>
      {/* Search Bar */}
      <ProductSearch onSearch={handleSearch} onClear={handleClearSearch} />

      {/* Filters */}
      <ProductFilter
        filters={filters}
        handleFilterChange={handleFilterChange}
        searchQuery={searchQuery}
      />
      <h1>Product Page</h1>

      {/* Products List */}
      <Products
        products={products}
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductPage;
