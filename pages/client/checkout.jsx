import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiTrash, BiMinus, BiPlus } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState(location.state?.cart || []);

  async function placeOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place order");
      return;
    }

    if (!phoneNumber || !address) {
      toast.error("Phone number and address are required");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const orderInformation = {
      products: cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      })),
      phone: phoneNumber,
      address: address,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderInformation,
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      toast.success("Order placed successfully");
      setCart([]);
    } catch (err) {
      console.error(err);
      toast.error("Error placing order");
    }
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  function changeQty(index, delta) {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-6 px-4 lg:px-8">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
        {/* Cart Items Section */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Checkout ({cart.length} items)
            </h2>
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-pink-200">
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Your cart is empty
                </p>
                <p className="text-gray-500 mb-4">
                  Add items to your cart to proceed with checkout!
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
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
                      <h3 className="text-base font-medium text-gray-800">
                        {item.name}
                      </h3>
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
                        className="p-1 bg-pink-200 rounded-md hover:bg-pink-300 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          changeQty(index, -1);
                        }}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <BiMinus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-base font-medium text-gray-700 w-8 text-center">
                        {item.qty}
                      </span>
                      <button
                        className="p-1 bg-pink-200 rounded-md hover:bg-pink-300 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          changeQty(index, 1);
                        }}
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
                      className="p-1 bg-pink-200 rounded-md hover:bg-pink-300 text-gray-600 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromCart(item.productId);
                      }}
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

        {/* Order Summary and Input Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
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
            <div className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 rounded-md border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-700"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-2 rounded-md border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-700"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button
              className="w-full py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200"
              onClick={placeOrder}
            >
              Place Order
            </button>
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