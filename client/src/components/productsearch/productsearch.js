import React, { useState } from 'react';

const ProductSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(''); // Local state for the search input

  // Handle changes in the search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the local search query state
  };

  // Handle form submission and pass the search query to the parent
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    onSearch(searchQuery); // Pass the search query to the parent via the onSearch function
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}> {/* Submit the form to trigger search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery} // Bind the input value to the state
          onChange={handleSearchChange} // Update the state when the input changes
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default ProductSearch;
