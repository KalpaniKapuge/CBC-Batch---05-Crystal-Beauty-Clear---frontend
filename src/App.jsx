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
import LoginPage from "../pages/login.jsx";
import RegisterPage from "../pages/register.jsx";
import ForgotPasswordPage from "../pages/forgetPassword.jsx";

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-center text-4xl font-bold text-red-600">404 Not Found</h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        {/* Client */}
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="search" element={<SearchProductPage />} />

        {/* Auth */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin */}
        <Route path="admin/products" element={<AdminProductsPage />} />
        <Route path="admin/orders" element={<AdminOrdersPage />} />
        <Route path="admin/add-product" element={<AddProductPage />} />
        <Route path="admin/edit-product" element={<EditProductPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
