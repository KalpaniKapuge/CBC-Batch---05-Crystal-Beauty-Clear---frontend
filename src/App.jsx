import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/mainLayout.jsx";
import HomePage from "../pages/home.jsx";
import AdminProductsPage from "../admin/adminProductsPage.jsx";
import AdminOrdersPage from "../admin/adminOrdersPage.jsx";
import AddProductPage from "../admin/addProductPage.jsx";
import EditProductPage from "../admin/editProductPage.jsx";
import CartPage from "../pages/client/cart.jsx";
import CheckoutPage from "../pages/client/checkout.jsx";
import SearchProductPage from "../pages/client/searchProductsPage.jsx";

function AboutPage() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-center text-3xl font-bold text-pink-600">About Us</h1>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-center text-3xl font-bold text-pink-600">Contact Us</h1>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-center text-3xl font-bold text-red-600">404 Not Found</h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}> {/* layout wrapper */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="edit-product" element={<EditProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="search" element={<SearchProductPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}