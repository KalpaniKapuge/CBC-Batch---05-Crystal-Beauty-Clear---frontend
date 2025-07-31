import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsCart } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const navigate = useNavigate();

  const closeDrawer = () => setSideDrawerOpened(false);
  const goHome = () => navigate("/");

  return (
    <header className="w-full h-[80px] shadow-2xl flex justify-center relative bg-white">
      <button
        aria-label="Open menu"
        className="md:hidden absolute left-2 flex items-center"
        onClick={() => setSideDrawerOpened(true)}
      >
        <GiHamburgerMenu className="text-3xl" />
      </button>

      <img
        onClick={goHome}
        src="/logo.png"
        alt="Logo"
        className="w-[80px] h-[80px] object-cover cursor-pointer"
      />

      <div className="hidden md:flex h-full w-[calc(100%-160px)] items-center justify-between px-4">
        <Link to="/" className="text-[20px] font-bold mx-2">
          Home
        </Link>
        <Link to="/products" className="text-[20px] font-bold mx-2">
          Products
        </Link>
        <Link to="/about" className="text-[20px] font-bold mx-2">
          About
        </Link>
        <Link to="/contact" className="text-[20px] font-bold mx-2">
          Contact
        </Link>
        <Link to="/search" className="text-[20px] font-bold mx-2">
          Search
        </Link>
      </div>

      <div className="hidden md:flex w-[80px] bg-pink-600 justify-center items-center">
        <Link to="/cart" className="text-[20px] font-bold mx-2 text-white">
          <BsCart size={24} />
        </Link>
      </div>

      {sideDrawerOpened && (
        <div className="fixed inset-0 bg-[#00000060] flex md:hidden z-50">
          <div className="w-[350px] bg-white h-full flex flex-col">
            <div className="w-full h-[80px] shadow-2xl flex justify-center items-center relative">
              <button
                aria-label="Close menu"
                className="absolute left-2"
                onClick={closeDrawer}
              >
                <GiHamburgerMenu className="text-3xl rotate-90" />
              </button>
              <img
                src="/logo.png"
                alt="Logo"
                onClick={() => {
                  closeDrawer();
                  navigate("/");
                }}
                className="w-[80px] h-[80px] object-cover cursor-pointer"
              />
            </div>
            <div className="flex-1 w-full flex flex-col items-center gap-2 py-6">
              <Link
                to="/"
                onClick={closeDrawer}
                className="text-[20px] font-bold my-4"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={closeDrawer}
                className="text-[20px] font-bold my-4"
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={closeDrawer}
                className="text-[20px] font-bold my-4"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={closeDrawer}
                className="text-[20px] font-bold my-4"
              >
                Contact
              </Link>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="text-[20px] font-bold my-4 flex items-center"
              >
                <BsCart size={24} />
                <span className="ml-2">Cart</span>
              </Link>
            </div>
          </div>
          {/* clicking outside closes */}
          <div
            className="flex-1"
            onClick={closeDrawer}
            aria-label="Backdrop"
            role="button"
          />
        </div>
      )}
    </header>
  );
}
