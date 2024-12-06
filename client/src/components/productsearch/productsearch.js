import React, { useState } from "react";

const ProductSearch = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // When Enter is pressed, if query is empty, show all products
      onSearch(query.trim() === "" ? "" : query);
    }
  };

  const handleClear = () => {
    setQuery(""); // Clear the input field
    onClear(); // Reset filters when search is cleared
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}  // Trigger search on Enter key press
        placeholder="Search for products"
      />
      {/* Clear button */}
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

export default ProductSearch;
