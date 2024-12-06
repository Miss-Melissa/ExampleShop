import React, { useState, useEffect } from "react";

const ProductSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Uppdatera debounced query efter en fördröjning
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);  // Skicka den debouncerade queryn till föräldern
    }
  }, [debouncedQuery, onSearch]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search for products"
      />
    </div>
  );
};

export default ProductSearch;
