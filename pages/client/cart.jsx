import { useState, useEffect } from "react";
import { BiTrash, BiMinus, BiPlus } from "react-icons/bi";
import { getTotal, getCart, removeFromCart, addToCart } from "../../utils/cart.js";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleDecrease = (item) => {
    addToCart(item, -1);
    setCart(getCart());
  };
  const handleIncrease = (item) => {
    addToCart(item, 1);
    setCart(getCart());
  };
  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-6 px-4 lg:px-8">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
        {/* Cart Items Section */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shopping Cart ({cart.length} items)</h2>
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-pink-200">
                <p className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</p>
                <p className="text-gray-500 mb-4">Explore our products and add items to your cart!</p>
                <Link
                  to="/collection"
                  className="inline-block px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-row items-center gap-4 p-4 border-b border-pink-300 hover:bg-pink-100 transition-colors duration-200"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border border-pink-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.productId}</p>
                      <div className="flex items-center mt-1">
                        {item.labelledPrice > item.price ? (
                          <>
                            <span className="text-sm text-gray-400 line-through mr-2">
                              Rs.{item.labelledPrice.toFixed(2)}
                            </span>
                            <span className="text-base font-semibold text-pink-600">
                              Rs.{item.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-semibold text-pink-600">
                            Rs.{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 bg-pink-200 rounded-md hover:bg-pink-200 transition-colors duration-200"
                        onClick={() => handleDecrease(item)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <BiMinus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-base font-medium text-gray-700 w-8 text-center">{item.qty}</span>
                      <button
                        className="p-1 bg-pink-200 rounded-md hover:bg-pink-200 transition-colors duration-200"
                        onClick={() => handleIncrease(item)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <BiPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-gray-800">
                        Rs.{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="p-1 bg-pink-200 rounded-md hover:bg-pink-200 text-gray-600 transition-colors duration-200"
                      onClick={() => handleRemove(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <BiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>Rs.{getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Shipping</span>
              <span className="text-gray-500">Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 border-t border-pink-300 pt-4 mb-4">
              <span>Total</span>
              <span>Rs.{getTotal().toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              state={{ cart }}
              className="w-full flex justify-center items-center py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200"
            >
              Proceed to Checkout
              <svg
                className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        body {
          font-family: 'Arial', sans-serif;
        }
        .sticky {
          position: sticky;
        }
      `}</style>
    </div>
  );
}