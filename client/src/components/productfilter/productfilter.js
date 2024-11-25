import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductFilter({ filters, handleFilterChange }) {
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    colors: [],
    brands: [],
    sizes: [],
  });

  useEffect(() => {
    // Fetch the available filter options from the backend
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products/filters');
        setFilterOptions(response.data); // Assuming the response structure contains categories, colors, brands, and sizes
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []); // This will run once when the component mounts

  // Handle slider change for price range (min/max)
  const handleSliderChange = (e) => {
    const { name, value } = e.target;

    // Ensure price_min is never greater than price_max and not equal
    if (name === "price_min") {
      if (value >= filters.price_max) {
        handleFilterChange({ target: { name: "price_min", value: filters.price_max - 10 } });
      } else if (value === filters.price_max) {
        handleFilterChange({ target: { name: "price_min", value: value - 10 } });
      } else {
        handleFilterChange({ target: { name, value } });
      }
    } else if (name === "price_max") {
      if (value <= filters.price_min) {
        handleFilterChange({ target: { name: "price_max", value: filters.price_min + 10 } });
      } else if (value === filters.price_min) {
        handleFilterChange({ target: { name: "price_max", value: value + 10 } });
      } else {
        handleFilterChange({ target: { name, value } });
      }
    }
  };

  return (
    <div>
      {/* Category Filter */}
      <select
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <option value="">Select Category</option>
        {filterOptions.categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Color Filter */}
      <select
        name="color"
        value={filters.color}
        onChange={handleFilterChange}
      >
        <option value="">Select Color</option>
        {filterOptions.colors.map((color, index) => (
          <option key={index} value={color}>
            {color}
          </option>
        ))}
      </select>

      {/* Brand Filter */}
      <select
        name="brand"
        value={filters.brand}
        onChange={handleFilterChange}
      >
        <option value="">Select Brand</option>
        {filterOptions.brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* Gender Filter */}
      <select
        name="gender"
        value={filters.gender}
        onChange={handleFilterChange}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="unisex">Unisex</option>
      </select>

      {/* Size Filter */}
      <select
        name="size"
        value={filters.size}
        onChange={handleFilterChange}
      >
        <option value="">Select Size</option>
        {filterOptions.sizes.map((size, index) => (
          <option key={index} value={size}>
            {size}
          </option>
        ))}
      </select>

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
