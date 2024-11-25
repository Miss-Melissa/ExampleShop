import React from 'react';
import BackBtn from '../backbtn/backbtn';
import BuyBtn from '../buybtn/buybtn';


const Product = ({ product, selectedSize, handleSizeChange }) => {

  const handleBuyClick = () => {
    alert('Product added to cart!');
    console.log(handleBuyClick);
  };

  if (!product) {
    return <p>No product data available</p>; // Display a fallback message
  }

  return (
    <div>
      <h1>{product.productName}</h1>
      <img src={product.productImage} alt={product.productName} height={300} />
            {/* Dropdown for sizes if available */}
            {product.productSize && product.productSize.length > 0 && (
        <div>
          <h4>Available Sizes:</h4>
          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)}>
            <option value="">Select a size</option>
            {product.productSize.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
      <p>Price: {product.productPrice} SEK</p>
      <p>Description: {product.productDescription}</p>
      <p>Quantity: {product.productQuantity}</p>
      <BuyBtn onClick={handleBuyClick} buttonText="Add to Cart" />
      <BackBtn />
    </div>
  );
};

export default Product;
