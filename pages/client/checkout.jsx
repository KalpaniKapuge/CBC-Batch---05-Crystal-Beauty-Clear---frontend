import { useState, useEffect } from "react";
import { BiTrash, BiMinus, BiPlus } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();

  const [cart, setCart] = useState(location.state?.cart || []);

  function removeFromCart(productID) {
    const newCart = cart.filter((item) => item.productID !== productID);
    setCart(newCart);
  }

  function changeQty(index, qty) {
    const newQty = cart[index].qty + qty;
    if (newQty <= 0) {
      removeFromCart(cart[index].productID);
      return;
    } else {
      const newCart = [...cart];
      newCart[index].qty = newQty;
      setCart(newCart);
    }
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-4 relative">
      <div className="w-[400px] h-[80px] shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center bg-white rounded-xl">
        <p className="text-2xl text-secondary font-bold">
          Total:
          <span className="text-accent font-bold mx-2">
            Rs.{getTotal().toFixed(2)}
          </span>
        </p>
        <Link
          to="/checkout"
          className="text-white bg-accent px-4 py-2 rounded-lg font-bold hover:bg-secondary transition-all duration-300"
        >
          Proceed to Checkout
        </Link>
      </div>

      {cart.length === 0 ? (
        <p className="mt-20 text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        cart.map((item, index) => (
          <div
            key={item.productID}
            className="w-[600px] h-[100px] rounded-tl-3xl rounded-bl-3xl my-4 bg-primary shadow-2xl flex flex-row relative justify-center items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-[100px] h-[100px] object-cover pl-4"
            />

            <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
              <h1 className="text-2xl text-secondary font-semibold">{item.name}</h1>
              <h2 className="text-md text-gray-600 font-semibold">{item.productID}</h2>
              {item.labelledPrice > item.price ? (
                <div>
                  <span className="text-md mx-1 text-gray-500 line-through">
                    Rs.{item.labelledPrice.toFixed(2)}
                  </span>
                  <span className="text-md mx-1 font-bold text-accent">
                    Rs.{item.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-md mx-1 font-bold text-accent">
                  Rs.{item.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="h-full w-[100px] flex flex-col justify-center items-center gap-1">
              <button
                className="bg-accent text-white p-1 rounded hover:bg-secondary"
                onClick={() => changeQty(index, -1)}
              >
                <BiMinus />
              </button>
              <span className="text-lg font-bold">{item.qty}</span>
              <button
                className="bg-accent text-white p-1 rounded hover:bg-secondary"
                onClick={() => changeQty(index, 1)}
              >
                <BiPlus />
              </button>
            </div>

            <div className="h-full w-[200px] flex flex-col justify-center items-end pr-4">
              <h1 className="text-xl text-secondary font-semibold">
                Rs.{(item.price * item.qty).toFixed(2)}
              </h1>
            </div>

            {/* Delete */}
            <button
              className="absolute right-[-30px] text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full"
              onClick={() => removeFromCart(item.productID)}
            >
              <BiTrash />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
