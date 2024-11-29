import React, { useState } from 'react';
import Products from '../../components/products/products'; // Import Products Component
import ProductSearch from '../../components/productsearch/productsearch';
import ProductFilter from '../../components/productfilter/productfilter'; // Assuming you have a filter component

function Home() {
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query
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
    setSearchQuery(query); // Update search query when user types
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      {/* Search Component */}
      <ProductSearch onSearch={handleSearch} />

      {/* Filter Component */}
      <ProductFilter filters={filters} handleFilterChange={handleFilterChange} />

      {/* Products Component */}
      <div>
        <h1>Welcome to the Shop!</h1>
        <Products searchQuery={searchQuery} filters={filters} />
      </div>
    </div>
  );
}

export default Home;
