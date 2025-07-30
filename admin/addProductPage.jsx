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

    const promiseArray = [];
    for (let i = 0; i < images.length; i++) {
      promiseArray.push(mediaUpload(images[i]));
    }

    try {
      const imageUrls = await Promise.all(promiseArray);
      console.log("Image URLs to save:", imageUrls);  // ✅ Log what is being saved

      const altNamesArray = altNames.split(",").map((name) => name.trim());

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center flex-col p-4">
      <input
        type="text"
        placeholder="Product ID"
        className="input input-bordered w-full max-w-xs mb-2"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full max-w-xs mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Alt Names (comma separated)"
        className="input input-bordered w-full max-w-xs mb-2"
        value={altNames}
        onChange={(e) => setAltNames(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="textarea textarea-bordered w-full max-w-xs mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        placeholder="Upload Images"
        multiple
        className="file-input file-input-bordered w-full max-w-xs mb-2"
        onChange={(e) => setImages(e.target.files)}
      />

      <input
        type="number"
        placeholder="Labelled Price"
        className="input input-bordered w-full max-w-xs mb-2"
        value={labelledPrice}
        onChange={(e) => setLabelledPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        className="input input-bordered w-full max-w-xs mb-2"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Stock"
        className="input input-bordered w-full max-w-xs mb-2"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <div className="w-full flex justify-center mt-4 items-center flex-row">
        <Link to="/admin/products" className="btn btn-secondary mr-4">
          Cancel
        </Link>
        <button
          className="bg-pink-500 text-white font-bold py-2 px-4 rounded"
          onClick={AddProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
}
