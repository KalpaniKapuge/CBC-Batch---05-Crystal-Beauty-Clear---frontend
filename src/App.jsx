import { Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import HomePage from "../pages/home.jsx";
import { Toaster } from "react-hot-toast";
import SearchProductPage from "../pages/client/searchProductsPage.jsx";
import LoginPage from "../pages/login.jsx";
import RegisterPage from "../pages/register.jsx";
import ProductOverviewPage from "../pages/client/productOverview.jsx";
import CartPage from "../pages/client/cart.jsx"; // Assuming path to cart.jsx
import CheckoutPage from "../pages/client/checkout.jsx"; // Assuming path to checkout.jsx
import AdminProductsPage from "../admin/adminProductsPage.jsx";
import AddProductPage from "../admin/addProductPage.jsx";
import EditProductPage from "../admin/editProductPage.jsx";
import AdminOrdersPage from "../admin/adminOrdersPage.jsx";

// Placeholder pages
function About() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">About Us</h1>
        <p className="text-gray-700">
          Crystal Bloom is dedicated to bringing you the finest makeup and beauty products with a touch of elegance.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-products" element={<SearchProductPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/overview/:id" element={<ProductOverviewPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/add-product" element={<AddProductPage />} />
        <Route path="/admin/edit-product" element={<EditProductPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Routes>
    </>
  );
}