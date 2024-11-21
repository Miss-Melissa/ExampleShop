import React, { useState } from 'react';
import Products from '../../components/products/products'; // Import Products Component
import ProductSearch from '../../components/productsearch/productsearch';

function Home() {
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query

  // Function to handle search input from the ProductSearch component
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query when user types
  };

  return (
    <div>
      {/* Pass the handleSearch function to ProductSearch */}
      <div>
        <ProductSearch onSearch={handleSearch} />
      </div>

      {/* Conditional rendering based on search query */}
      {searchQuery ? (
        // If there is a search query, show products with the search query filter
        <Products searchQuery={searchQuery} />
      ) : (
        // If no search query, show the welcome message and the Products component with no filter
        <div>
          <h1>Welcome to the Shop!</h1>
          <Products searchQuery="" /> {/* Ensure all products are shown by passing an empty query */}
        </div>
      )}
    </div>
  );
}

export default Home;
