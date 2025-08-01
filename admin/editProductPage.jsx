import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../utils/mediaUpload.jsx";

export default function EditProductPage() {
  const location = useLocation();
  const initial = location.state || {};
  const [productId] = useState(initial.productId || "");
  const [name, setName] = useState(initial.name || "");
  const [altNames, setAltNames] = useState((initial.altNames || []).join(", "));
  const [images, setImages] = useState([]);
  const [labelledPrice, setLabelledPrice] = useState(initial.labelledPrice || 0);
  const [price, setPrice] = useState(initial.price || 0);
  const [stock, setStock] = useState(initial.stock || 0);
  const [description, setDescription] = useState(initial.description || "");
  const navigate = useNavigate();

  async function UpdateProduct() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update product");
      return;
    }

    let finalImages = initial.images || [];
    if (images.length > 0) {
      const promiseArray = Array.from(images).map((f) => mediaUpload(f));
      finalImages = await Promise.all(promiseArray);
    }

    const altNamesArray = altNames.split(",").map((n) => n.trim());
    const product = { productId, name, altNames: altNamesArray, images: finalImages, labelledPrice, price, stock, description };

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, product, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating product");
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center flex-col p-4">
      <input type="text" disabled placeholder="Product ID" className="input input-bordered w-full max-w-xs mb-2" value={productId} />
      <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs mb-2" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Alt Names (comma separated)" className="input input-bordered w-full max-w-xs mb-2" value={altNames} onChange={(e) => setAltNames(e.target.value)} />
      <textarea placeholder="Description" className="textarea textarea-bordered w-full max-w-xs mb-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="file" multiple className="file-input file-input-bordered w-full max-w-xs mb-2" onChange={(e) => setImages(e.target.files)} />
      <input type="number" placeholder="Labelled Price" className="input input-bordered w-full max-w-xs mb-2" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} />
      <input type="number" placeholder="Price" className="input input-bordered w-full max-w-xs mb-2" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Stock" className="input input-bordered w-full max-w-xs mb-2" value={stock} onChange={(e) => setStock(e.target.value)} />
      <div className="w-full flex justify-center mt-4 items-center flex-row">
        <Link to="/admin/products" className="btn btn-secondary mr-4">Cancel</Link>
        <button className="bg-pink-500 text-white font-bold py-2 px-4 rounded" onClick={UpdateProduct}>Update Product</button>
      </div>
    </div>
  );
}