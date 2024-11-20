import React from 'react';

const Product = ({ product }) => {
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
    </div>
  );
};

export default Product;
