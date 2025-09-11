import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const imageSrc =
    (product.images && product.images.length > 0 && product.images[0]) ||
    "https://via.placeholder.com/150";

  return (
    <Link
      to={`/overview/${product.productId}`}
      className="group block w-48 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden backdrop-blur-sm"
    >
      <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-pink-50 to-purple-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-32 object-contain p-3 group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-3 relative">
        <h1 className="text-sm font-semibold text-gray-800 mb-1.5 truncate group-hover:text-pink-600 transition-colors duration-200">
          {product.name}
        </h1>

        <p className="text-gray-500 text-[11px] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-gray-400 mb-0.5">
              Was
            </span>
            <p className="text-gray-400 line-through text-[11px] font-medium">
              ${product.labelledPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-pink-500 mb-0.5 block">
              Now
            </span>
            <h2 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  );
}
