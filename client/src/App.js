import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import Footer from "./components/footer/footer";
import Product from "./components/product/product";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import ProductsPage from "./pages/products/productsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product" element={<Product />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
