import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../utils/mediaUpload.jsx";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [images, setImages] = useState([]);
  const [labelledPrice, setLabelledPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  async function AddProduct() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to add a product");
      return;
    }
    if (!images || images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    const promiseArray = Array.from(images).map((f) => mediaUpload(f));
    try {
      const imageUrls = await Promise.all(promiseArray);
      const altNamesArray = altNames.split(",").map((n) => n.trim());
      const product = { productId, name, altNames: altNamesArray, images: imageUrls, labelledPrice, price, stock, description };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, product, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Add New Product</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Product ID</label>
              <input
                type="text"
                placeholder="Enter Product ID"
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Enter Product Name"
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Alternative Names (comma separated)</label>
              <input
                type="text"
                placeholder="Enter Alternative Names"
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={altNames}
                onChange={(e) => setAltNames(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
              <textarea
                placeholder="Enter Product Description"
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Product Images</label>
              <input
                type="file"
                multiple
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 transition"
                onChange={(e) => setImages(e.target.files)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Labelled Price</label>
              <input
                type="number"
                placeholder="Enter Labelled Price"
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={labelledPrice}
                onChange={(e) => setLabelledPrice(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Price</label>
              <input
                type="number"
                placeholder="Enter Price"
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Stock</label>
              <input
                type="number"
                placeholder="Enter Stock Quantity"
                className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Link
                to="/admin/products"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </Link>
              <button
                onClick={AddProduct}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}