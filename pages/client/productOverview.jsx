import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "../../src/components/loading.jsx";
import { addToCart } from "../../utils/cart.js";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../../utils/wishlist.js";
import { BiPlus, BiMinus, BiHeart, BiSolidHeart } from "react-icons/bi";

export default function ProductOverviewPage() {
  const navigate = useNavigate();
  const params = useParams();
  const productId = params.id;

  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching product with token:", token);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(res.data);
        setMainImage(res.data.images?.[0] || "https://via.placeholder.com/400");
        const isWishlisted = await isInWishlist(res.data.productId);
        setInWishlist(isWishlisted);
        console.log("Product in wishlist:", isWishlisted);
        setStatus("success");
      } catch (error) {
        console.log("Error fetching product:", error.response?.data || error);
        setStatus("error");
        toast.error("Error fetching product details");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/products/${productId}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error.response?.data || error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const checkLoginAndNavigate = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  const toggleWishlist = async () => {
    if (!checkLoginAndNavigate()) return;
    
    if (!product) {
      console.log("No product data, cannot toggle wishlist");
      return;
    }
    try {
      if (inWishlist) {
        toast.success("Already in wishlist");
      } else {
        await addToWishlist(product);
        setInWishlist(true);
      }
      // Navigate after state update
      setTimeout(() => navigate("/wishlist"), 0);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = () => {
    if (!checkLoginAndNavigate()) return;
    
    try {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    if (!checkLoginAndNavigate()) return;
    
    navigate("/checkout", {
      state: {
        cart: [
          {
            productId: product.productId,
            name: product.name,
            image: product.images[0] || "https://via.placeholder.com/150",
            price: product.price,
            labelledPrice: product.labelledPrice,
            qty: quantity,
          },
        ],
      },
    });
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!checkLoginAndNavigate()) return;
    
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a valid rating");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Submitting review with token:", token || "No token found");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${productId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Review submission response:", response.data);
      toast.success("Review added");
      // Refetch reviews
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/products/${productId}`);
      setReviews(res.data);
      // Update product averages
      const prodRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProduct(prodRes.data);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Review submission error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-3"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the product details.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {status === "success" && product && (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-3 py-6">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                
                {/* Image Section */}
                <div className="lg:w-1/2 w-full p-6 flex flex-col lg:flex-row items-start gap-4">
                  
                  {/* Thumbnails on the left */}
                  <div className="flex lg:flex-col flex-row gap-3">
                    {(product.images || []).map((img, idx) => (
                      <div
                        key={idx}
                        className={`w-20 h-20 flex items-center justify-center rounded-md border-1 cursor-pointer transition ${
                          mainImage === img
                            ? "border-pink-500"
                            : "border-gray-200"
                        }`}
                        onMouseEnter={() => setMainImage(img)}
                      >
                        <img
                          src={img}
                          alt="thumbnail"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Main Image */}
                  <div className="relative flex-1 flex items-center justify-center">
                    <div className="w-[400px] h-[400px] flex items-center justify-center border-1 rounded-xl bg-white">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={toggleWishlist}
                      className="absolute top-3 cursor-pointer right-3 p-2 rounded-full bg-pink-600 shadow hover:bg-white hover:border-pink-600 hover:border-2 transition"
                    >
                      {inWishlist ? (
                        <BiSolidHeart size={20} className="text-white hover:text-pink-600" />
                      ) : (
                        <BiHeart size={20} className="text-white hover:text-pink-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="lg:w-1/2 w-full p-6 lg:p-8">
                  {/* Product Title */}
                  <div className="mb-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                      {product.name}
                    </h1>
                    {product.altNames && product.altNames.length > 0 && (
                      <p className="text-sm text-gray-500 mb-1">
                        Also known as: {product.altNames.join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>SKU: {product.productId}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-green-600 font-medium">
                        {product.stock > 0 ? "✓ In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(product.averageRating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.averageRating.toFixed(1)} ({product.numReviews} reviews)
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    {product.labelledPrice > product.price ? (
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xl text-gray-400 line-through">
                          ${product.labelledPrice.toFixed(2)}
                        </span>
                        <span className="text-3xl font-bold text-pink-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Save {Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-pink-600">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description || "No description available."}
                    </p>
                  </div>

                  {/* Specifications */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-gray-800 mb-3">Specifications</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                              <span className="font-medium text-gray-700">{key}</span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quantity & Actions */}
                  <div className="space-y-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-800">Quantity:</span>
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={handleDecrease}
                          className="px-2 py-1 rounded hover:bg-white hover:shadow transition disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          <BiMinus size={16} className="text-gray-600" />
                        </button>
                        <span className="px-4 py-1 font-semibold text-sm text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={handleIncrease}
                          className="px-2 py-1 rounded hover:bg-white hover:shadow transition"
                        >
                          <BiPlus size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold text-base hover:bg-pink-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 text-pink-500 bg-white py-3 border-2 border-pink-500 rounded-lg font-semibold text-base hover:bg-pink-200 transition"
                      >
                        Buy Now
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-5 mt-6 pt-4 border-t border-gray-200 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>🔒</span> Secure Payment
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🚚</span> Fast Delivery
                      </div>
                      <div className="flex items-center gap-1">
                        <span>↩️</span> Easy Returns
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-4 flex gap-4"
                    >
                      <img
                        src={review.user.image || "https://via.placeholder.com/50"}
                        alt={`${review.user.firstName} ${review.user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800">
                            {review.user.firstName} {review.user.lastName}
                          </span>
                          <span className="text-yellow-500 font-semibold">
                            {review.rating} ★
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Your Review</h2>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    rows="4"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                    submitting ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}