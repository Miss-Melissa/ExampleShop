import React, { useState } from 'react';
import Products from '../../components/products/products'; // Import Products Component

function Home() {
  const [searchQuery, setSearchQuery] = useState(''); // To store search query

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query as the user types
  };

  return (
    <div>
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Conditional rendering based on search query */}
      {searchQuery ? (
        // If there is a search query, show products with the search query filter
        <Products searchQuery={searchQuery} />
      ) : (
        // If no search query, show the welcome message and the Products component with no filter
        <div>
          <h1>Welcome to the Shop!</h1>
          <p>Search for products by name or category.</p>
          <Products searchQuery="" /> {/* Ensure all products are shown by passing an empty query */}
        </div>
      )}
    </div>
  );
}

export default Home;
