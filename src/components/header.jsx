import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsCart } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";


// Lightweight JWT decoder for payload (no external lib)
function safeParseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let payload = parts[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4 === 0 ? "" : "=".repeat(4 - (payload.length % 4));
    const decoded = atob(payload + pad);
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Header() {
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = safeParseJwt(token);
      if (decoded) {
        setUser({
          firstName: decoded.firstName || "",
          lastName: decoded.lastName || "",
          role: decoded.role || "",
        });
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const closeDrawer = () => setSideDrawerOpened(false);
  const goHome = () => navigate("/");

  return (
    <header className="w-full h-20 sticky top-0 z-50 flex items-center px-6 md:px-12 bg-gradient-to-r from-pink-50 to-pink-100 shadow-xl">
      <button
        aria-label="Open menu"
        className="md:hidden flex items-center text-pink-600 p-2 rounded-full hover:bg-pink-50 transition"
        onClick={() => setSideDrawerOpened(true)}
      >
        <GiHamburgerMenu size={24} />
      </button>

      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={goHome}>
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
        <span className="hidden sm:inline font-extrabold text-2xl text-pink-700 tracking-tight">
          Crystal Bloom
        </span>
      </div>

      <nav className="hidden md:flex flex-1 justify-center gap-10 font-medium text-gray-700">
        <Link
          to="/"
          className="relative px-3 py-2 rounded-full hover:text-white hover:bg-pink-600 transition-all duration-200"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="relative px-3 py-2 rounded-full hover:text-white hover:bg-pink-600 transition-all duration-200"
        >
          About
        </Link>
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        {!user ? (
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 border border-pink-500 rounded-full hover:bg-pink-50 text-pink-600 font-semibold transition focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-pink-600 text-white rounded-full hover:brightness-105 font-semibold transition focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <div className="text-sm text-pink-800 flex items-center gap-2">
              <div>
                {user.firstName} {user.lastName}
              </div>
              {user.role === "admin" && (
                <span className="ml-1 text-xs bg-yellow-100 px-2 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Logout
            </button>
          </div>
        )}

        <div className="hidden md:flex items-center">
          <Link
            to="/cart"
            aria-label="Go to cart"
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full text-white shadow-lg hover:scale-105 transform transition"
          >
            <BsCart size={24} />
          </Link>
        </div>
        <Link
          to="/cart"
          className="md:hidden flex items-center justify-center w-12 h-12 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition-colors duration-200"
          aria-label="Go to cart"
        >
          <BsCart size={24} />
        </Link>
      </div>

      {sideDrawerOpened && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="flex-1 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-label="Close menu backdrop"
            role="button"
          />
          <div className="w-72 bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="h-20 flex items-center justify-between px-4 border-b">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  closeDrawer();
                  navigate("/");
                }}
              >
                <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
                <span className="font-bold text-lg text-pink-700">Crystal Bloom</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={closeDrawer}
                className="text-pink-600 hover:text-pink-800 transition-colors duration-200 p-2 rounded-full"
              >
                <GiHamburgerMenu size={24} className="rotate-90" />
              </button>
            </div>
            <nav className="flex flex-col px-6 py-8 space-y-4 text-base font-semibold text-gray-700">
              <Link to="/" onClick={closeDrawer} className="hover:text-pink-600 rounded-md px-2 py-1 transition">
                Home
              </Link>
              <Link to="/about" onClick={closeDrawer} className="hover:text-pink-600 rounded-md px-2 py-1 transition">
                About
              </Link>
              <Link to="/cart" onClick={closeDrawer} className="flex items-center space-x-3 hover:text-pink-600 rounded-md px-2 py-1 transition">
                <BsCart size={22} />
                <span>Cart</span>
              </Link>
              {!user ? (
                <>
                  <Link to="/login" onClick={closeDrawer} className="hover:text-pink-600 rounded-md px-2 py-1 transition">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeDrawer} className="hover:text-pink-600 rounded-md px-2 py-1 transition">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-pink-800 font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeDrawer();
                    }}
                    className="text-left hover:text-pink-600 rounded-md px-2 py-1 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
