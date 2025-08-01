import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete a product");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting product");
    }
  };

  return (
    <div className="w-full h-full p-6 bg-gradient-to-br from-gray-100 to-gray-200 relative min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Product Management</h1>

      <div className="overflow-x-auto rounded-lg shadow-xl bg-white p-4">
        {isLoading ? (
          <div className="w-full h-64 flex justify-center items-center">
            <div className="w-[70px] h-[70px] border-4 border-dashed border-pink-500 rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-300 text-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">Product ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Labelled Price</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="px-4 py-3">{item.productId}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">
                    <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md shadow-md border" />
                  </td>
                  <td className="px-4 py-3">Rs. {item.labelledPrice}</td>
                  <td className="px-4 py-3">Rs. {item.price}</td>
                  <td className="px-4 py-3">{item.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center w-full">
                      <FaTrash className="text-[20px] text-red-500 mx-2 cursor-pointer" onClick={() => deleteProduct(item.productId)} />
                      <FaEdit className="text-[20px] text-blue-500 mx-2 cursor-pointer" onClick={() => navigate("/admin/edit-product", { state: item })} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link
        to="/admin/add-product"
        className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white text-3xl px-5 py-3 rounded-full shadow-lg transition duration-300 z-50"
        title="Add Product"
      >
        +
      </Link>
    </div>
  );
}