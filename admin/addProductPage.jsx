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
  const [labelledPrice, setLabelledPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
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
      const product = {
        productId,
        name,
        altNames: altNamesArray,
        images: imageUrls,
        labelledPrice,
        price,
        stock,
        description,
      };
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        product,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-3">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-pink-500 px-6 py-5">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
              Add New Product
            </h1>
            <p className="text-pink-100 text-sm">
              Create a new product listing for your store
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Product ID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter unique product ID"
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 transition"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Alternative Names
                  </label>
                  <input
                    type="text"
                    placeholder="Comma separated alternative names"
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 transition"
                    value={altNames}
                    onChange={(e) => setAltNames(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple names with commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Product Description
                  </label>
                  <textarea
                    placeholder="Describe your product in detail..."
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 transition resize-none"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="Available quantity"
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 transition"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                    Pricing Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Labelled Price
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Labelled Price"
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-pink-500 transition"
                        value={labelledPrice}
                        onChange={(e) => setLabelledPrice(parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Selling Price *
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Selling Price"
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-pink-500 transition"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Product Images *
                  </label>
                  <div className="relative">
                    <div className="w-full p-6 bg-pink-50 border-2 border-dashed border-pink-300 rounded-lg hover:border-pink-500 transition">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setImages(e.target.files)}
                      />
                      <div className="text-center">
                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                        </div>
                        <p className="text-gray-600 font-medium text-sm">Click to upload images</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each</p>
                      </div>
                    </div>
                  </div>
                  {images && images.length > 0 && (
                    <p className="text-sm text-pink-600 mt-2 font-medium">
                      {images.length} file(s) selected
                    </p>
                  )}
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-3">Product Features</h3>
                  <div className="flex flex-col gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>High quality product images recommended</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Detailed description increases sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Competitive pricing attracts customers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-gray-300">
              <Link
                to="/admin/products"
                className="px-6 py-2.5 bg-white border-2 border-pink-500 text-pink-500 rounded-lg font-semibold text-sm hover:bg-pink-200 transition text-center"
              >
                Cancel
              </Link>
              <button
                onClick={AddProduct}
                className="px-6 py-2.5 bg-pink-500 text-white rounded-lg font-semibold text-sm hover:bg-pink-600 transition"
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