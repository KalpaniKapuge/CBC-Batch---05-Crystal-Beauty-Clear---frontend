import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImageSlider from "../../src/components/imageSlider.jsx";
import Loading from "../../src/components/loading.jsx";
import { addToCart, getCart } from "../../utils/cart.js";

export default function ProductOverviewPage() {
  const navigate = useNavigate();
  const params = useParams();
  const productId = params.id;

  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
        setStatus("success");
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
        toast.error("Error fetching product details");
      });
  }, [productId]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex justify-center items-center text-red-500 text-lg">
        Failed to load product details.
      </div>
    );
  }

  return (
    <>
      {status === "success" && product && (
        <div className="w-full min-h-screen flex flex-col md:flex-row p-6 bg-gray-50">
          {/* Image Section */}
          <div className="md:w-1/2 w-full h-full flex justify-center items-center mb-6 md:mb-0">
            <ImageSlider images={product.images || ["https://via.placeholder.com/400"]} />
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 w-full h-full flex flex-col justify-start items-start px-6">
            <h1 className="text-3xl md:text-4xl text-gray-800 font-bold mb-2">
              {product.name}
              {product.altNames && product.altNames.length > 0 && (
                <span className="text-xl text-gray-500 mx-2">
                  ({product.altNames.join(", ")})
                </span>
              )}
            </h1>
            <h2 className="text-sm text-gray-500 font-medium mb-4">
              Product ID: {product.productId}
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              {product.description || "No description available."}
            </p>

            {/* Pricing */}
            <div className="mb-6">
              {product.labelledPrice > product.price ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.labelledPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-pink-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600">
                    ({Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}% off)
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-pink-600">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="mb-6 w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Specifications</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  console.log("Current cart:", getCart());
                  addToCart(product, 1);
                  console.log("Updated cart:", getCart());
                  toast.success("Added to cart");
                }}
                className="w-[200px] bg-pink-500 text-white py-3 rounded-2xl hover:bg-pink-600 transition-all duration-300 font-semibold"
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
                          qty: 1,
                        },
                      ],
                    },
                  });
                }}
                className="w-[200px] bg-pink-600 text-white py-3 rounded-2xl hover:bg-pink-700 transition-all duration-300 font-semibold"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}