import React, { useState } from 'react';
import Products from '../../components/products/products'; // Your Products component
import ProductSearch from '../../components/productsearch/productsearch'; // Your ProductSearch component

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle search input from the ProductSearch component
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query when user submits the search
  };

  return (
    <div>
      {/* Pass the handleSearch function as a prop to ProductSearch */}
      <ProductSearch onSearch={handleSearch} />
      
      <h1>Products Page</h1>
      
      {/* Pass searchQuery as a prop to Products to filter products */}
      <Products searchQuery={searchQuery} />
    </div>
  );
};

export default ProductsPage;
