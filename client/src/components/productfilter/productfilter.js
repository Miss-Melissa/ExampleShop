import React from "react";

function ProductFilter({ filters, handleFilterChange }) {
  // Handle slider change for price range (min/max)
  const handleSliderChange = (e) => {
    const { name, value } = e.target;

    // Ensure price_min is never greater than price_max and not equal
    if (name === "price_min") {
      // If price_min is greater than price_max, update price_min to price_max
      if (value >= filters.price_max) {
        handleFilterChange({ target: { name: "price_min", value: filters.price_max - 10 } });
      } else if (value === filters.price_max) {
        // If price_min is equal to price_max, set it one step lower
        handleFilterChange({ target: { name: "price_min", value: value - 10 } });
      } else {
        handleFilterChange({ target: { name, value } });
      }
    } else if (name === "price_max") {
      // If price_max is less than price_min, update price_max to price_min
      if (value <= filters.price_min) {
        handleFilterChange({ target: { name: "price_max", value: filters.price_min + 10 } });
      } else if (value === filters.price_min) {
        // If price_max is equal to price_min, set it one step higher
        handleFilterChange({ target: { name: "price_max", value: value + 10 } });
      } else {
        handleFilterChange({ target: { name, value } });
      }
    }
  };

  return (
    <div>
      {/* Other filters */}
      <input
        type="text"
        name="category"
        value={filters.category}
        placeholder="Category"
        onChange={handleFilterChange}
      />

      <input
        type="text"
        name="color"
        value={filters.color}
        placeholder="Color"
        onChange={handleFilterChange}
      />

      <input
        type="text"
        name="brand"
        value={filters.brand}
        placeholder="Brand"
        onChange={handleFilterChange}
      />

      <input
        type="text"
        name="gender"
        value={filters.gender}
        placeholder="Gender"
        onChange={handleFilterChange}
      />

      <input
        type="text"
        name="size"
        value={filters.size}
        placeholder="Size (e.g., S,M,L)"
        onChange={handleFilterChange}
      />

      {/* Price Range Filter */}
      <div>
        <label>Price Range:</label>
        <div>
          <input
            type="range"
            name="price_min"
            min="0"
            max="1000"
            step="10"
            value={filters.price_min}
            onChange={handleSliderChange}
          />
          <input
            type="range"
            name="price_max"
            min="0"
            max="1000"
            step="10"
            value={filters.price_max}
            onChange={handleSliderChange}
          />
        </div>
        <p>
          Selected Price Range: ${filters.price_min} - ${filters.price_max}
        </p>
      </div>
    </div>
  );
}

export default ProductFilter;
