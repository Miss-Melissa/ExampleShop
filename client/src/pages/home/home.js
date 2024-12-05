import React, { useState, useEffect } from "react";
import axios from "axios";
import Products from "../../components/products/products"; // Import Products Component
import ProductSearch from "../../components/productsearch/productsearch";
import ProductFilter from "../../components/productfilter/productfilter";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    brand: "",
    gender: "",
    size: "",
    price_min: 0,
    price_max: 1000,
  });

  // Fetch products when page, searchQuery, or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch products from the API with search and filter parameters
        const response = await axios.get("http://localhost:5000/products/search", {
          params: {
            page,
            limit,
            searchQuery,
            ...filters, // Pass filters along with search query
          },
        });

        if (response.data.products) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchQuery, filters]); // Dependencies: page, searchQuery, filters

  // Handle page change (pagination)
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle search query change
  const handleSearch = (query) => {
    setSearchQuery(query); // Update search query state
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // If loading, display a loading message
  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h1>Welcome to the Shop!</h1>

      {/* Search Component */}
      <ProductSearch onSearch={handleSearch} />

      {/* Filter Component */}
      <ProductFilter filters={filters} handleFilterChange={handleFilterChange} />

      {/* Pass the fetched products, page, totalPages, and page change handler as props */}
      <Products
        products={products}
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

export default Home;
