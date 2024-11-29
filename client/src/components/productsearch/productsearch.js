import React, { useState, useEffect } from 'react';

const ProductSearch = ({ onSearch, filters }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the local search query state
    onSearch(query, filters); // Pass the query and filters to the parent component
  };

  useEffect(() => {
    // Automatically trigger search when filters are applied
    if (filters) {
      onSearch(searchQuery, filters);
    }
  }, [filters, searchQuery, onSearch]); // Re-run when either filters or searchQuery changes

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange} // Trigger search as the user types
      />
    </div>
  );
};

export default ProductSearch;
