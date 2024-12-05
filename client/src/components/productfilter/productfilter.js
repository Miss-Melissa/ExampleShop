import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductFilter({ filters, handleFilterChange }) {
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    colors: [],
    brands: [],
    sizes: [],
    genders: []  // Genders array will be populated with real data from the DB
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch filter options based on selected filters
  const fetchFilterOptions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query string based on selected filters
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.color) queryParams.append("color", filters.color);
      if (filters.size) queryParams.append("size", filters.size);
      if (filters.brand) queryParams.append("brand", filters.brand);
      if (filters.gender) queryParams.append("gender", filters.gender);

      // Fetch filter options from the backend (including genders from DB)
      const response = await axios.get(
        `http://localhost:5000/products/filters?${queryParams.toString()}`
      );

      setFilterOptions({
        categories: response.data.categories,
        colors: response.data.colors,
        brands: response.data.brands,
        sizes: response.data.sizes,
        genders: response.data.genders || [], 
      });
    } catch (error) {
      setError("Error fetching filter options");
      console.error("Error fetching filter options:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to trigger fetching filters when the filters state changes
  useEffect(() => {
    fetchFilterOptions();
  }, [filters]); // Triggered whenever any filter is changed

  // Handle price range slider change
  const handleSliderChange = (e) => {
    const { name, value } = e.target;

    if (name === "price_min") {
      const newValue = Math.min(value, filters.price_max - 10); // Ensures price_min is not greater than price_max
      handleFilterChange({ target: { name, value: newValue } });
    } else if (name === "price_max") {
      const newValue = Math.max(value, filters.price_min + 10); // Ensures price_max is not smaller than price_min
      handleFilterChange({ target: { name, value: newValue } });
    }
  };

  // Check if any filter is applied
  const isFilterApplied = () => {
    return (
      filters.category ||
      filters.color ||
      filters.brand ||
      filters.size ||
      filters.gender ||
      filters.price_min !== 0 ||
      filters.price_max !== 1000
    );
  };

  // Handle the changes in any of the filters
  const handleFilterChangeInternal = (e) => {
    handleFilterChange(e);
  };

  return (
    <div>
      {loading && <p>Loading filter options...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Category Filter */}
      <select
        name="category"
        value={filters.category}
        onChange={handleFilterChangeInternal}
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
        onChange={handleFilterChangeInternal}
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
        onChange={handleFilterChangeInternal}
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
        onChange={handleFilterChangeInternal}
      >
        <option value="">Select Gender</option>
        {filterOptions.genders.map((gender, index) => (
          <option key={index} value={gender}>
            {gender}
          </option>
        ))}
      </select>

      {/* Size Filter */}
      <select
        name="size"
        value={filters.size}
        onChange={handleFilterChangeInternal}
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
        <p>Min: {filters.price_min} - Max: {filters.price_max}</p>
      </div>
    </div>
  );
}

export default ProductFilter;
