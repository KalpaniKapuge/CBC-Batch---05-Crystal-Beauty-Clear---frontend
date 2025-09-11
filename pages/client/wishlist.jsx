import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getWishlist, removeFromWishlist } from "../../utils/wishlist.js";
import { addToCart } from "../../utils/cart.js";
import { BiTrash, BiHeart } from "react-icons/bi";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const wishlistData = await getWishlist();
        setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      const updatedWishlist = await getWishlist();
      setWishlist(Array.isArray(updatedWishlist) ? updatedWishlist : []);
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success("Added to cart");
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col justify-center items-center">
        <p className="text-gray-600">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col justify-center items-center">
        <div className="text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 max-w-md">
          <BiHeart size={60} className="text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 mb-3">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add products you love to your wishlist!
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 mb-4">
            My Wishlist
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            You have {wishlist.length} items saved for later
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {wishlist.map((product) => (
            <div
              key={product.productId}
              className="group block w-48 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden backdrop-blur-sm mx-auto"
            >
              <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-pink-50 to-purple-50">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-32 object-contain p-3 group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <button
                  onClick={() => handleRemove(product.productId)}
                  className="absolute top-2 right-2 p-2 hover:bg-white rounded-full shadow border border-white hover:border-pink-500 bg-pink-500 transition"
                >
                  <BiTrash size={20} className="hover:text-pink-600 text-white" />
                </button>
              </div>

              <div className="p-3 relative">
                <h3 className="text-sm font-semibold text-gray-800 mb-1.5 truncate group-hover:text-pink-600 transition-colors duration-200">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.labelledPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.labelledPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Add to Cart
                </button>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}