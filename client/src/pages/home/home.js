import React from "react";
import Products from "../../components/products/products"; // Import Products Component

function Home() {
  return (
    <div>
      <h1>Welcome to the Shop!</h1>
      {/* Render Products Component */}
      <Products />
    </div>
  );
}

export default Home;
