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

      {/* Conditional rendering */}
      {searchQuery ? (
        <Products searchQuery={searchQuery} /> // Show products if there is a search query
      ) : (
        <div>
          <h1>Welcome to the Shop!</h1>
          <p>Search for products by name or category.</p>
        </div> // Show basic content if there is no search query
      )}
    </div>
  );
}

export default Home;
