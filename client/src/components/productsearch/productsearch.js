import React, { useState } from 'react';

const ProductSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value; // Get the value of the input
    setSearchQuery(query); // Update the local search query state
    onSearch(query); // Pass the query directly to the parent component
  };

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
