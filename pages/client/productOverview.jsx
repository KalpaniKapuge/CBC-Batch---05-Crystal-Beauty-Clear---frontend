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
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setMainImage(response.data.images?.[0] || "https://via.placeholder.com/400");
        setInWishlist(isInWishlist(response.data.productId));
        setStatus("success");
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
        toast.error("Error fetching product details");
      });
  }, [productId]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
    setInWishlist(!inWishlist);
    navigate("/wishlist"); // Navigate to wishlist page after toggling
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
                    <div className="w-[400px] h-[400px] flex items-center justify-center border-1  rounded-xl bg-white">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={toggleWishlist}
                      className="absolute top-3 right-3 p-2 rounded-full bg-pink-600 shadow hover:bg-white hover:border-pink-600 hover:border-2 transition"
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
                      <span className="text-green-600 font-medium">✓ In Stock</span>
                    </div>
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
                  {product.specifications && (
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
                        onClick={() => {
                          addToCart(product, quantity);
                          toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`);
                          navigate("/cart");
                        }}
                        className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold text-base hover:bg-pink-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
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
                        }}
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
          </div>
        </div>
      )}
    </>
  );
}