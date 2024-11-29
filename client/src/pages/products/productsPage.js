import React, { useState } from "react";
import Products from "../../components/products/products"; // Your Products component
import ProductSearch from "../../components/productsearch/productsearch"; // Your ProductSearch component
import ProductFilter from "../../components/productfilter/productfilter";

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    size: '',
    brand: '',
    gender: '',
    price_min: 0,
    price_max: 1000,
  });

  // Function to handle search input from the ProductSearch component
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query when user submits the search
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div>
      {/* Search Component */}
      <ProductSearch onSearch={handleSearch} />

      {/* Filter Component */}
      <ProductFilter
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      <h1>Products Page</h1>

      {/* Pass searchQuery and filters as props to Products */}
      <Products searchQuery={searchQuery} filters={filters} />
    </div>
  );
};

export default ProductsPage;
