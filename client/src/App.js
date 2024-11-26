import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home/home";
import Footer from "./components/footer/footer";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import ProductsPage from "./pages/products/productsPage";
import ProductPage from "./pages/product/productPage";
import ProductUploadPage from "./pages/productupload/productUploadPage";
import ProductUpdatePage from "./pages/productupdate/productUpdatePage";

function App() {
  return (
    <div>
      <BrowserRouter
        // Opt-in to future React Router v7 features
        future={{
          v7_startTransition: true, // Start transition early for better performance
          v7_relativeSplatPath: true, // New behavior for relative splat paths
        }}
      >
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/productupload" element={<ProductUploadPage />} />
            <Route path="/products/update/:id" element={<ProductUpdatePage />} />

          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
