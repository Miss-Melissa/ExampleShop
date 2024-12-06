import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductSearch from "../../components/productsearch/productsearch";
import ProductFilter from "../../components/productfilter/productfilter";
import Products from "../../components/products/products";
import ProductSort from "../../components/productsort/productsort";

const ProductPage = () => {
  const [products, setProducts] = useState([]); // Store fetched products
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [page, setPage] = useState(1); // Current page
  const [sortOrder, setSortOrder] = useState(""); // Default no sort order
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    size: "",
    brand: "",
    gender: "",
    price_min: 0,
    price_max: 10000,
  }); // Current filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  
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
        sortOrder, // Attach sortOrder to query params
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
  }, [filters, searchQuery, page, sortOrder]); // Make sure these are the correct dependencies

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
      price_max: 10000,
      sortOrder
    });
    setSortOrder('');
    setPage(1); // Reset to the first page
  };

  // Handle sort order change
  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder); // Update the sort order
    setPage(1); // Reset to the first page on sort change
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

      {/* Sort Order */}
      <ProductSort onSortChange={handleSortChange} currentSortOrder={sortOrder} />

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
