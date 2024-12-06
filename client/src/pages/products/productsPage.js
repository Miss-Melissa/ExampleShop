import React, { useState, useEffect } from "react";
import axios from "axios";
import Products from "../../components/products/products";
import ProductSearch from "../../components/productsearch/productsearch";
import ProductFilter from "../../components/productfilter/productfilter";

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");  // För sökfråga
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    brand: "",
    size: "",
    gender: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hantera förändring av sökquery
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Hantera förändring av filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Fetch data baserat på både sökquery och filter
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("searchQuery", searchQuery);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.color) queryParams.append("color", filters.color);
      if (filters.size) queryParams.append("size", filters.size);
      if (filters.brand) queryParams.append("brand", filters.brand);
      if (filters.gender) queryParams.append("gender", filters.gender);

      const response = await axios.get(
        `http://localhost:5000/products?${queryParams.toString()}`
      );
      setFilteredProducts(response.data);  // Uppdatera produktlistan
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();  // Hämta produkter när sökquery eller filter ändras
  }, [searchQuery, filters]);

  return (
    <div>
      <ProductSearch onSearch={handleSearchChange} />
      <ProductFilter filters={filters} handleFilterChange={handleFilterChange} searchQuery={searchQuery} />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <Products products={filteredProducts} />
      )}
    </div>
  );
};

export default ProductsPage;
