import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cart.js";
import { toast } from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const imageSrc =
    (product.images && product.images.length > 0 && product.images[0]) ||
    "https://via.placeholder.com/150";

  return (
    <Link
      to={`/overview/${product.productId}`}
      className="block max-w-sm w-full bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 ease-in-out p-6"
    >
      <div className="relative overflow-hidden rounded-2xl mb-5">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-56 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-pink-200 text-pink-500 text-xs font-semibold px-3 py-1 rounded-full shadow">
          New
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-pink-600 mb-3 truncate">
        {product.name}
      </h1>

      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
        {product.description}
      </p>

      {/* Price info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="block text-xs uppercase font-semibold tracking-wider text-gray-400 mb-1">
            Labelled Price
          </span>
          <p className="text-gray-500 line-through text-sm">${product.labelledPrice.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <span className="block text-xs uppercase font-semibold tracking-wider text-pink-500 mb-1">
            Price
          </span>
          <h2 className="text-3xl font-bold text-pink-500">${product.price.toFixed(2)}</h2>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
            toast.success("Added to cart");
            navigate("/cart");
          }}
          className="flex-1 bg-pink-100 border border-pink-400 text-pink-700 font-semibold py-3 rounded-2xl hover:bg-pink-200 hover:border-pink-500 transition-all duration-300 shadow-sm"
        >
          Add to Cart
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
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
          className="flex-1 bg-pink-500 text-white font-semibold py-3 rounded-2xl hover:bg-pink-600 transition-all duration-300 shadow-md"
        >
          Buy Now
        </button>
      </div>
    </Link>
  );
}