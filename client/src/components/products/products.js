import React, { useState } from "react";
import { Link } from "react-router-dom";
import BuyBtn from "../buybtn/buybtn";  // Update the path as per your folder structure

const Products = ({ products, page, totalPages, handlePageChange }) => {
  const [selectedSizes, setSelectedSizes] = useState({});

  // Handle size selection
  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  // Handle Buy button click
  const handleBuyClick = (productId) => {
    alert(`Product ${productId} added to cart!`);
  };

  return (
    <div>
      {/* Render the list of products */}
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id || `${product.productName}-${product.productPrice}`} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd" }}>
            {/* Product Link */}
            <Link to={`/products/${product._id}`} style={{ textDecoration: "none", color: "#333" }}>
              <h3>{product.productName}</h3>

              {/* Render multiple images if available */}
              {product.productImages && product.productImages.length > 0 ? (
                <div>
                  {product.productImages.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/${image}`}
                      alt={`${product.productName} image ${index + 1}`}
                      style={{ width: "200px", margin: "10px" }} // Adjust styling as needed
                    />
                  ))}
                </div>
              ) : (
                <p>No images available</p>
              )}

              <p>Price: ${product.productPrice}</p>
            </Link>

            {/* Size selection */}
            {product.productSize && product.productSize.length > 0 ? (
              <div>
                <h4>Available Sizes:</h4>
                <select
                  value={selectedSizes[product._id] || ""}
                  onChange={(e) => handleSizeChange(product._id, e.target.value)}
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

            {/* Buy button */}
            <BuyBtn onClick={() => handleBuyClick(product._id)} />
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}

      {/* Pagination Controls */}
      <div>
        {page > 1 && (
          <button onClick={() => handlePageChange(page - 1)}>Previous Page</button>
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <button onClick={() => handlePageChange(page + 1)}>Next Page</button>
        )}
      </div>
    </div>
  );
};

export default Products;
