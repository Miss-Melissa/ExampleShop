import React from 'react';
import BackBtn from '../backbtn/backbtn';
import BuyBtn from '../buybtn/buybtn';

// You can optionally import the slick carousel here if you'd like to display images in a slider
// import Slider from 'react-slick'; 

const Product = ({ product, selectedSize, handleSizeChange }) => {
  // Check if the product exists and has valid data
  if (!product) {
    return <p>No product data available</p>; // Display a fallback message if no product data
  }

  // Handle the Buy button click action
  const handleBuyClick = () => {
    if (selectedSize) {
      alert(`Product added to cart! Size selected: ${selectedSize}`);
    } else {
      alert('Please select a size before adding to the cart.');
    }
    console.log(`Added ${product.productName} to cart`);
  };

  return (
    <div>
      <h1>{product.productName}</h1>
      
      {/* Render multiple images if available */}
      {product.productImages && product.productImages.length > 0 ? (
        <div>
          {product.productImages.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${image}`}
              alt={`${product.productName} image ${index + 1}`}
              style={{ width: '300px', margin: '10px' }} // Customize the styling as needed
            />
          ))}
        </div>
      ) : (
        <img 
          src={`http://localhost:5000/uploads/${product.productImage}`} // Fallback to a single image if no productImages array
          alt={product.productName}
          height={300} 
        />
      )}

      {product.productSize && product.productSize.length > 0 ? (
        <div>
          <h4>Available Sizes:</h4>
          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)} // Handling size change
          >
            <option value="">Select a size</option>
            {product.productSize.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>No sizes available</p>
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
