import { Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import HomePage from "../pages/home.jsx";
import toast, { Toaster } from "react-hot-toast";
import SearchProductPage from "../pages/client/searchProductsPage.jsx";


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
function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Login</h2>
      </div>
    </div>
  );
}
function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Register</h2>
      </div>
    </div>
  );
}
function Cart() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pink-600">Your Cart</h1>
        <p className="text-gray-600">No items yet.</p>
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}
