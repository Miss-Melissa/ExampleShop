import React, { useState, useEffect } from "react";

const ProductSearch = ({ onSearch }) => {
  const [query, setQuery] = useState(""); // Local query state
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query state

  // Debounce logic to delay the search query update
  useEffect(() => {
    // Create a timer to delay the update
    const timer = setTimeout(() => {
      setDebouncedQuery(query); // Set the debounced query after 500ms
    }, 500);

    // Cleanup the previous timer when the query changes before the timer ends
    return () => {
      console.log("Clearing debounce timer...");
      clearTimeout(timer);
    };
  }, [query]); // Runs every time query changes

  useEffect(() => {
    // Perform the search when debounced query is updated
    if (debouncedQuery.trim() !== "") {
      console.log("Search triggered with query:", debouncedQuery);
      onSearch(debouncedQuery); // Pass the debounced query to the parent component
    } else if (debouncedQuery === "") {
      console.log("Search query is empty, no search triggered");
      // Optionally, you can trigger a reset behavior here if needed
    }
  }, [debouncedQuery, onSearch]); // Runs when debouncedQuery changes

  // Handle input changes
  const handleInputChange = (e) => {
    setQuery(e.target.value); // Update local query state on user input
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search products..."
      />
    </div>
  );
};

export default ProductSearch;
