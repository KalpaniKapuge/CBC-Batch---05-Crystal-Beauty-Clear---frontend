// New wishlist.jsx (in pages/client directory)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getWishlist, removeFromWishlist } from "../../utils/wishlist.js";
import { addToCart } from "../../utils/cart.js";
import { BiTrash, BiHeart } from "react-icons/bi";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const handleRemove = (productId) => {
    const updated = removeFromWishlist(productId);
    setWishlist(updated);
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success("Added to cart");
    navigate("/cart");
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md max-w-md">
          <BiHeart size={60} className="text-pink-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">Add products you love to your wishlist!</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length} items)</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => handleRemove(product.productId)}
                  className="absolute top-2 right-2 p-2 hover:bg-white rounded-full shadow  border border-white hover:border-pink-500 bg-pink-500 transition"
                >
                  <BiTrash size={20} className="hover:text-pink-600 text-white" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-pink-600">${product.price.toFixed(2)}</span>
                  {product.labelledPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">${product.labelledPrice.toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-auto py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}