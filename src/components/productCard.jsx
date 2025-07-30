import React from "react";

export default function ProductCard({ product }) {
  return (
    <Link  to = {"/overview/" +product.productId }className="card p-4 border rounded shadow-md bg-white w-full max-w-sm">
      <img
        src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/150"}
        alt={product.name}
        className="productImage w-full h-48 object-cover rounded"
      />
      <h1 className="text-xl font-semibold mt-2">{product.name}</h1>
      <p className="text-gray-600 mt-1">{product.description}</p>
      <h2 className="text-lg font-bold text-green-600 mt-2">${product.price}</h2>
      <div className="flex justify-between mt-4">
        <button className="addToCart bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded">
          Add To Cart
        </button>
        <button className="buyNow bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded">
          Buy Now
        </button>
      </div>
    </Link>
  );
}
