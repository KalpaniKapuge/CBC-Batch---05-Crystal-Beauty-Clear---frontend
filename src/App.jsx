import { Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import HomePage from "../pages/home.jsx";
import { Toaster } from "react-hot-toast";
import SearchProductPage from "../pages/client/searchProductsPage.jsx";
import LoginPage from "../pages/login.jsx";
import RegisterPage from "../pages/register.jsx";
import ProductOverviewPage from "../pages/client/productOverview.jsx";
import CartPage from "../pages/client/cart.jsx";
import CheckoutPage from "../pages/client/checkout.jsx";
import WishlistPage from "../pages/client/wishlist.jsx";
import AdminProductsPage from "../admin/adminProductsPage.jsx";
import AddProductPage from "../admin/addProductPage.jsx";
import EditProductPage from "../admin/editProductPage.jsx";
import AdminOrdersPage from "../admin/adminOrdersPage.jsx";
import Collection from "../pages/collection.jsx";
import ForgotPasswordPage from "../pages/forgetPassword.jsx"; 

export default function App() {
  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-products" element={<SearchProductPage />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/overview/:id" element={<ProductOverviewPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/add-product" element={<AddProductPage />} />
        <Route path="/admin/edit-product" element={<EditProductPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Routes>
    </>
  );
}