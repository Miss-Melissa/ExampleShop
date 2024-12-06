import React, { useState } from "react";
import ProductSearch from "../../components/productsearch/productsearch";
import ProductFilter from "../../components/productfilter/productfilter";
import Products from "../../components/products/products";

const ProductsPage = ({ products, totalPages, handlePageChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    size: "",
    priceRange: [0, 1000], // Exempel på prisspann
  });

  // Hantera sökändring
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Hantera filterändring
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtrera produkterna baserat på sökquery och filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = filters.size ? product.productSize.includes(filters.size) : true;
    const matchesPrice = product.productPrice >= filters.priceRange[0] && product.productPrice <= filters.priceRange[1];
    
    return matchesSearch && matchesSize && matchesPrice;
  });

  return (
    <div>
      {/* Sök- och filterkomponenter */}
      <ProductSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <ProductFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Produktlistan */}
      <Products
        products={filteredProducts}
        page={1} // Sätt aktuellt sidnummer
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductsPage;
