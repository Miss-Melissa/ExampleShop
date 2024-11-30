import React, { useState } from "react";
import Products from "../../components/products/products"; // Import Products Component
import ProductSearch from "../../components/productsearch/productsearch";
import ProductFilter from "../../components/productfilter/productfilter"; // Assuming you have a filter component

function Home() {
  // Shared state for search query and filters
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <h1>Welcome to the Shop!</h1>

      {/* Search Component */}
      <ProductSearch onSearch={handleSearch} />

      {/* Products Component */}
      <Products searchQuery={searchQuery} />
    </div>
  );
}

export default Home;
