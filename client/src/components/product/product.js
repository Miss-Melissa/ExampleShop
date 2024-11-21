import React from 'react';

const Product = ({ product, selectedSize, handleSizeChange }) => {
  if (!product) {
    return <p>No product data available</p>; // If there's no product, display a message
  }

  return (
    <div>
      <h1>{product.productName}</h1>
      <img src={product.productImage} alt={product.productName} height={300} />
      <p>Price: {product.productPrice} SEK</p>
      <p>Description: {product.productDescription}</p>
      <p>Quantity: {product.productQuantity}</p>

      {/* Only show the dropdown for sizes if product has sizes */}
      {product.productSize && product.productSize.length > 0 && (
        <div>
          <h4>Available Sizes:</h4>
          <select 
            value={selectedSize} 
            onChange={(e) => handleSizeChange(e.target.value)}
            style={{ padding: '5px', margin: '10px 0' }}
          >
            <option value="">Select a size</option>
            {product.productSize.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Product;
