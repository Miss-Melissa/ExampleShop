import React, { useState } from "react";
import Products from "../../components/products/products"; // Your Products component
import ProductSearch from "../../components/productsearch/productsearch"; // Your ProductSearch component
import ProductFilter from "../../components/productfilter/productfilter";

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search input from the ProductSearch component
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query when user submits the search
  };

  return (
    <div>
      {/* Search Component */}
      <ProductSearch onSearch={handleSearch} />

      <h1>Products Page</h1>

      {/* Pass searchQuery and filters as props to Products */}
      <Products searchQuery={searchQuery} />
    </div>
  );
};

export default ProductsPage;
