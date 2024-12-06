import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductUpload from "../../components/productupload/productupload";

const ProductUploadPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch the products from the server
  const fetchProducts = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get("http://localhost:5000/products", {
        params: {
          page: 1,   // The first page
          limit: 10  // Showing 10 products per page
        }
      });
      console.log(response.data); // Kontrollera att rätt data returneras'
      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setError("Invalid data format received.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to fetch products. Please try again later.");
      setLoading(false);
    }
  };
  

  // Handle delete product action
  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Make a DELETE request to remove the product
        await axios.delete(`http://localhost:5000/products/${_id}`);
        setProducts(products.filter((product) => product._id !== _id)); // Filter out the deleted product
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // Handle update product action
  const handleUpdate = (_id) => {
    navigate(`/products/update/${_id}`);
  };

  // Fetch products when the component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product Upload Page</h1>
      <ProductUpload />

      <h2>Product List</h2>
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && products.length === 0 && <p>No products found.</p>}
      {!loading && products.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Photos</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.productImages && product.productImages.length > 0 ? (
                    <div>
                      {product.productImages.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`${product.productName} image ${index + 1}`}
                          height={100}
                          style={{ margin: "10px" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p>No images available</p>
                  )}
                </td>
                <td>{product.productName}</td>
                <td>${Number(product.productPrice).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleUpdate(product._id)}>Update</button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductUploadPage;
