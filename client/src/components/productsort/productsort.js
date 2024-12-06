// ProductSort.jsx
import React from 'react';

const ProductSort = ({ onSortChange, currentSortOrder }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value); // Send the new sort order to the parent component
  };

  return (
    <div>
      <label htmlFor="sortOrder">Sort By:</label>
      <select
        id="sortOrder"
        value={currentSortOrder}
        onChange={handleSortChange}
      >
        <option value="">Default</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>
  );
};

export default ProductSort;
