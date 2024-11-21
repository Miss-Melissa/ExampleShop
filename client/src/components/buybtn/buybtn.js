// BuyButton.js
import React from 'react';

function BuyBtn({ onClick, buttonText = "Buy Now" }) {
  return (
    <button onClick={onClick} className="buy-btn">
      {buttonText}
    </button>
  );
}

export default BuyBtn;
