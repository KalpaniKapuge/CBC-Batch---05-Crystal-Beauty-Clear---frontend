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
    <div className="w-full h-full flex flex-col items-center pt-4 relative">
      <div className="w-[400px] h-[80px] shadow-2xl absolute top-1 right-1 flex flex-col justify-center items-center bg-white rounded-xl p-4">
        <p className="text-2xl text-secondary font-bold">
          Total:
          <span className="text-accent font-bold mx-2">Rs.{getTotal().toFixed(2)}</span>
        </p>
        <Link
          to="/checkout"
          state={{ cart }}
          className="text-white bg-accent px-4 py-2 rounded-lg font-bold hover:bg-secondary transition-all duration-300"
        >
          Checkout
        </Link>
      </div>

      {cart.length === 0 ? (
        <p className="mt-20 text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.productId}
            className="w-[600px] h-[100px] rounded-tl-3xl rounded-bl-3xl my-4 bg-white shadow-2xl flex flex-row relative justify-center items-center"
          >
            <img src={item.image} alt={item.name} className="w-[100px] h-[100px] object-cover pl-4" />

            <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
              <h1 className="text-2xl text-secondary font-semibold">{item.name}</h1>
              <h1 className="text-md text-gray-600 font-semibold">{item.productId}</h1>
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

            <div className="h-full max-w-[100px] w-[100px] flex flex-row justify-evenly items-center">
              <button
                className="text-white font-bold rounded-xl hover:bg-secondary p-2 text-xl cursor-pointer aspect-square bg-accent"
                onClick={() => handleDecrease(item)}
              >
                <BiMinus />
              </button>
              <h1 className="text-xl text-secondary font-semibold h-full flex items-center">{item.qty}</h1>
              <button
                className="text-white font-bold rounded-xl hover:bg-secondary p-2 text-xl cursor-pointer aspect-square bg-accent"
                onClick={() => handleIncrease(item)}
              >
                <BiPlus />
              </button>
            </div>

            <div className="h-full w-[200px] flex flex-col justify-center items-end pr-4">
              <h1 className="text-2xl text-secondary font-semibold">
                Rs.{(item.price * item.qty).toFixed(2)}
              </h1>
            </div>

            <button
              className="absolute hover:bg-red-600 hover:text-white rounded-full p-2 right-[-35px] text-red-600 cursor-pointer"
              onClick={() => handleRemove(item.productId)}
            >
              <BiTrash />
            </button>
          </div>
        ))
      )}
    </div>
  );
}