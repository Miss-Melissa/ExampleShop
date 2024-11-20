import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import Footer from "./components/footer/footer";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import ProductsPage from "./pages/products/productsPage";
import ProductPage from "./pages/product/productPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductPage />} />           
            </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
