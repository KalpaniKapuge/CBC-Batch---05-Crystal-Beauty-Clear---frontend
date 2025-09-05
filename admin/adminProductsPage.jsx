import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        const productsData = res.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId?.toString().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const deleteProduct = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete a product");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) {
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

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-pink-100 rounded w-1/3"></div>
              <div className="h-3 bg-pink-100 rounded w-2/3"></div>
            </div>
            <div className="h-3 bg-pink-100 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-pink-500 px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Product Management</h1>
                <p className="text-pink-100 text-sm">Manage your store's product listings</p>
              </div>
              <div className="relative max-w-sm w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-500 w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search by product name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition duration-300 shadow-md hover:shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Products</p>
                  <p className="text-xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-pink-500 text-lg">📦</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">In Stock</p>
                  <p className="text-xl font-bold text-gray-900">{products.filter(p => p.stock > 0).length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Out of Stock</p>
                  <p className="text-xl font-bold text-gray-900">{products.filter(p => p.stock === 0).length}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="p-6">
            {isLoading ? (
              <div className="p-4">
                <LoadingSkeleton />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-500 text-2xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No products found" : "No products yet"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {searchTerm 
                    ? `No products match "${searchTerm}"`
                    : "Start by adding your first product to the store"
                  }
                </p>
                {!searchTerm && (
                  <Link
                    to="/admin/add-product"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition duration-200"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add First Product
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="bg-pink-400 text-white sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-sm rounded-tl-xl">Product ID</th>
                      <th className="px-6 py-3 font-semibold text-sm">Product</th>
                      <th className="px-6 py-3 font-semibold text-sm">Pricing</th>
                      <th className="px-6 py-3 font-semibold text-sm">Stock</th>
                      <th className="px-6 py-3 font-semibold text-sm text-center rounded-tr-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item, index) => (
                      <tr
                        key={item.productId}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-pink-100"
                        } hover:bg-pink-200 transition duration-200 border-b border-gray-200 last:border-b-0 shadow-sm hover:shadow-md`}
                      >
                        <td className="px-6 py-4 text-gray-800 font-medium text-sm">#{item.productId}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={item.images?.[0] || "/api/placeholder/64/64"}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-lg border border-pink-300 shadow-sm hover:shadow-md transition duration-200"
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/64/64";
                                }}
                              />
                              {item.stock === 0 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">{item.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {item.labelledPrice !== item.price && (
                              <div className="text-xs text-gray-500 line-through">Rs. {item.labelledPrice}</div>
                            )}
                            <div className="text-sm font-semibold text-gray-900">Rs. {item.price}</div>
                            {item.labelledPrice !== item.price && (
                              <div className="text-xs text-green-600 font-medium">
                                {Math.round(((item.labelledPrice - item.price) / item.labelledPrice) * 100)}% OFF
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.stock > 10
                                ? "bg-green-100 text-green-700"
                                : item.stock > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => navigate("/admin/edit-product", { state: item })}
                              className="p-2 text-pink-500 hover:bg-pink-100 rounded-lg transition duration-200 cursor-pointer"
                              title="Edit Product"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(item.productId)}
                              className="p-2 text-pink-500 hover:bg-pink-100 rounded-lg transition duration-200 cursor-pointer"
                              title="Delete Product"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <Link
            to="/admin/add-product"
            className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition duration-300 z-50"
            title="Add Product"
          >
            <FaPlus className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}