import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsCart } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // placeholder: decode or fetch user if needed; minimal display
      setUser({});
    }
  }, []);

  const closeDrawer = () => setSideDrawerOpened(false);
  const goHome = () => navigate("/");

  return (
    <header className="w-full h-20 shadow-md bg-white flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
      <button
        aria-label="Open menu"
        className="md:hidden flex items-center text-pink-600"
        onClick={() => setSideDrawerOpened(true)}
      >
        <GiHamburgerMenu size={28} />
      </button>

      <div className="flex items-center gap-4 cursor-pointer" onClick={goHome}>
        <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
      </div>

      <nav className="hidden md:flex items-center space-x-6 font-semibold text-gray-700">
        <Link to="/" className="hover:text-pink-600 transition-colors duration-200">
          Home
        </Link>
        <Link to="/products" className="hover:text-pink-600 transition-colors duration-200">
          Products
        </Link>
        <Link to="/about" className="hover:text-pink-600 transition-colors duration-200">
          About
        </Link>
        <Link to="/contact" className="hover:text-pink-600 transition-colors duration-200">
          Contact
        </Link>
        <Link to="/search" className="hover:text-pink-600 transition-colors duration-200">
          Search
        </Link>
        <Link to="/cart" className="relative flex items-center justify-center w-12 h-12 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition-colors duration-200" aria-label="Go to cart">
          <BsCart size={24} />
        </Link>
        {!user && (
          <>
            <Link
              to="/login"
              className="px-4 py-2 border border-pink-500 rounded hover:bg-pink-50 text-pink-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Register
            </Link>
          </>
        )}
      </nav>

      <Link
        to="/cart"
        className="md:hidden flex items-center justify-center w-12 h-12 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition-colors duration-200"
        aria-label="Go to cart"
      >
        <BsCart size={24} />
      </Link>

      {sideDrawerOpened && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={closeDrawer}
            aria-label="Close menu backdrop"
            role="button"
          />
          <div className="w-72 bg-white shadow-lg flex flex-col">
            <div className="h-20 flex items-center justify-between px-4 border-b">
              <img
                src="/logo.png"
                alt="Logo"
                onClick={() => {
                  closeDrawer();
                  navigate("/");
                }}
                className="w-16 h-16 object-contain cursor-pointer"
              />
              <button
                aria-label="Close menu"
                onClick={closeDrawer}
                className="text-pink-600 hover:text-pink-800 transition-colors duration-200"
              >
                <GiHamburgerMenu size={28} className="rotate-90" />
              </button>
            </div>
            <nav className="flex flex-col px-6 py-8 space-y-4 text-lg font-semibold text-gray-700">
              <Link to="/" onClick={closeDrawer} className="hover:text-pink-600">
                Home
              </Link>
              <Link to="/products" onClick={closeDrawer} className="hover:text-pink-600">
                Products
              </Link>
              <Link to="/about" onClick={closeDrawer} className="hover:text-pink-600">
                About
              </Link>
              <Link to="/contact" onClick={closeDrawer} className="hover:text-pink-600">
                Contact
              </Link>
              <Link to="/search" onClick={closeDrawer} className="hover:text-pink-600">
                Search
              </Link>
              <Link to="/cart" onClick={closeDrawer} className="flex items-center space-x-3 hover:text-pink-600">
                <BsCart size={24} />
                <span>Cart</span>
              </Link>
              {!user && (
                <>
                  <Link to="/login" onClick={closeDrawer} className="hover:text-pink-600">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeDrawer} className="hover:text-pink-600">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}