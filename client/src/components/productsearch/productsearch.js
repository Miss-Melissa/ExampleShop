import React, { useState, useEffect } from "react";

const ProductSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce effect to minimize frequent updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after a delay
    }, 300); // Adjust delay as needed (300ms is common for debouncing)

    return () => {
      clearTimeout(handler); // Cleanup debounce timeout
    };
  }, [searchQuery]);

  useEffect(() => {
    onSearch(debouncedQuery); // Trigger search only when debounced query changes
  }, [debouncedQuery, onSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery(""); // Clear search query
    onSearch(""); // Notify parent of cleared search
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        aria-label="Search products"
      />
      {searchQuery && <button onClick={clearSearch}>Clear</button>} {/* Show clear button only if there's a query */}
    </div>
  );
};

export default ProductSearch;
