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
      products: cart.map((item) => ({ productId: item.productId, qty: item.qty })),
      phone: phoneNumber,
      address: address,
    };

    try {
      const res = await axios.post(
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

  function changeQty(index, qty) {
    setCart((prev) => {
      const clone = [...prev];
      const newQty = clone[index].qty + qty;
      if (newQty <= 0) return prev;
      clone[index].qty = newQty;
      return clone;
    });
  }

  return (
    <div className="w-full h-full flex flex-col items-center pt-4 relative">
      <div className="w-[400px] min-h-[200px] shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center bg-white rounded-xl p-4 gap-2">
        <p className="text-2xl text-secondary font-bold">
          Total:
          <span className="text-accent font-bold mx-2">Rs.{getTotal().toFixed(2)}</span>
        </p>

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full h-[40px] px-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full h-[40px] px-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          className="bg-accent text-white w-full py-2 rounded hover:bg-secondary font-bold transition-all duration-300"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="mt-20 text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        cart.map((item, index) => (
          <div
            key={item.productId}
            className="w-[600px] h-[100px] rounded-tl-3xl rounded-bl-3xl my-4 bg-white shadow-2xl flex flex-row relative justify-center items-center"
          >
            <img src={item.image} alt={item.name} className="w-[100px] h-[100px] object-cover pl-4" />
            <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
              <h1 className="text-2xl text-secondary font-semibold">{item.name}</h1>
              <h2 className="text-md text-gray-600 font-semibold">{item.productId}</h2>
              {item.labelledPrice > item.price ? (
                <div>
                  <span className="text-md mx-1 text-gray-500 line-through">Rs.{item.labelledPrice.toFixed(2)}</span>
                  <span className="text-md mx-1 font-bold text-accent">Rs.{item.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-md mx-1 font-bold text-accent">Rs.{item.price.toFixed(2)}</span>
              )}
            </div>

            <div className="h-full w-[100px] flex flex-col justify-center items-center gap-1">
              <button className="bg-accent text-white p-1 rounded hover:bg-secondary" onClick={() => changeQty(index, -1)}>
                <BiMinus />
              </button>
              <span className="text-lg font-bold">{item.qty}</span>
              <button className="bg-accent text-white p-1 rounded hover:bg-secondary" onClick={() => changeQty(index, 1)}>
                <BiPlus />
              </button>
            </div>

            <div className="h-full w-[200px] flex flex-col justify-center items-end pr-4">
              <h1 className="text-xl text-secondary font-semibold">Rs.{(item.price * item.qty).toFixed(2)}</h1>
            </div>

            <button className="absolute right-[-30px] text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full" onClick={() => removeFromCart(item.productId)}>
              <BiTrash />
            </button>
          </div>
        ))
      )}
    </div>
  );
}