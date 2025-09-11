import { useState, useEffect, useRef, useCallback } from "react";
import { BsSearch } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../src/components/productCard.jsx";

const carouselSlides = [
  {
    id: 1,
    title: "Radiant Summer Glow",
    subtitle: "Fresh makeup for sunny days.",
    image: "/c1.png",
    cta: "Shop Now",
    link: "/",
  },
  {
    id: 2,
    title: "Bold & Beautiful Lips",
    subtitle: "Colors that speak louder.",
    image: "/c3.png",
    cta: "Explore",
    link: "/",
  },
  {
    id: 3,
    title: "Limited Edition Set",
    subtitle: "Glow like never before.",
    image: "/c2.jpg",
    cta: "Buy Now",
    link: "/",
  },
];

// Preload carousel images
carouselSlides.forEach((s) => {
  const img = new Image();
  img.src = s.image;
  img.onerror = () => console.log(`Failed to load image: ${s.image}`);
});

function Carousel() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const isHoveredRef = useRef(false);

  const advance = useCallback(
    () => setIndex((i) => (i + 1) % carouselSlides.length),
    []
  );

  useEffect(() => {
    function startInterval() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isHoveredRef.current) {
          advance();
        }
      }, 4000);
    }
    startInterval();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [advance]);

  const prev = () =>
    setIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
  const next = () => setIndex((i) => (i + 1) % carouselSlides.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="relative w-full h-80 md:h-[500px] overflow-hidden rounded-3xl shadow-2xl mt-10 bg-gradient-to-br from-pink-50 via-white to-pink-100 group"
      role="region"
      aria-label="Promotional carousel"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-200 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {carouselSlides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            i === index
              ? "opacity-100 pointer-events-auto z-10 scale-100"
              : "opacity-0 pointer-events-none z-0 scale-105"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat flex items-center relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(236,72,153,0.1) 100%), url(${slide.image})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 opacity-20 animate-gradient-x"></div>

            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
                  style={{
                    left: `${20 + idx * 15}%`,
                    top: `${30 + (idx % 3) * 20}%`,
                    animationDelay: `${idx * 0.5}s`,
                    animationDuration: `${3 + idx * 0.5}s`,
                  }}
                ></div>
              ))}
            </div>

            <div className="relative z-10 bg-white/95 backdrop-blur-lg rounded-2xl p-8 ml-8 max-w-lg shadow-2xl border border-pink-200 transform hover:scale-105 transition-transform duration-300">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full"></div>

              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800 mb-3 leading-tight animate-glow">
                {slide.title}
              </h2>
              <p className="text-pink-700 mb-6 text-base md:text-lg font-medium leading-relaxed">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-pink-500 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group"
              >
                <span className="mr-2">{slide.cta}</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
      ))}

      <button
        aria-label="Previous slide"
        onClick={() =>
          setIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/40 p-4 rounded-full shadow-xl hover:shadow-pink-300 hover:scale-125 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400/50 z-20 group border border-pink-300"
      >
        <FaChevronLeft className="w-5 h-5 text-pink-700 group-hover:text-pink-900 transition-colors duration-300" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() =>
          setIndex((i) => (i + 1) % carouselSlides.length)
        }
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/40 p-4 rounded-full shadow-xl hover:shadow-pink-300 hover:scale-125 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400/50 z-20 group border border-pink-300"
      >
        <FaChevronRight className="w-5 h-5 text-pink-700 group-hover:text-pink-900 transition-colors duration-300" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
            className={`relative transition-all duration-300 ${
              i === index
                ? "w-8 h-3 bg-gradient-to-r from-pink-500 to-pink-700 scale-125 shadow-lg"
                : "w-3 h-3 bg-white/70 hover:bg-white/90 hover:scale-110"
            } rounded-full`}
          >
            {i === index && (
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-700 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-pink-700 transition-all duration-4000 ease-linear"
          style={{ width: `${((index + 1) / carouselSlides.length) * 100}%` }}
        ></div>
      </div>

      <div className="sr-only" aria-live="polite">
        {`Slide ${index + 1} of ${carouselSlides.length}: ${carouselSlides[index].title}`}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="w-full flex justify-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-300"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        if (isMountedRef.current) setProducts(res.data || []);
      } catch (error) {
        if (isMountedRef.current)
          toast.error(error.response?.data?.message || "Error fetching products");
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      navigate(`/search-products?query=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
       
        {/* Search bar: icon only, navigates away */}
<div className=" flex justify-center">
  <div className="w-full max-w-3xl relative">
    <div className="relative flex items-center gap-0 rounded-full overflow-hidden border border-pink-400 bg-white/90 backdrop-blur-xl drop-shadow-sm">

      <input
        type="text"
        placeholder="Search makeup, skincare, collections..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        aria-label="Search"
        className="flex-1 px-6 py-3 outline-none text-pink-700 bg-transparent placeholder-pink-300 text-lg"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <div
        onClick={handleSearch}
        role="button"
        aria-label="Search"
        className="flex items-center justify-center px-5 py-3 cursor-pointer"
      >
        <div className="p-2 rounded-full bg-gradient-to-r from-pink-300 to-pink-500  hover:scale-140 transition-transform duration-200 ">
          <BsSearch size={20} className="text-white" />
        </div>
      </div>
    </div>
    {/* subtle outer glow / focus ring */}
    <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-pink-200/60"></div>
  </div>
</div>

        <Carousel />

        {/* Featured Products header */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 mb-2">
              Featured Products
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full shadow-md"></div>
          </div>
          <div className="text-lg text-pink-700 font-medium px-6 py-2 bg-white/70 backdrop-blur-lg rounded-full shadow-lg">
            {isLoading
              ? "Loading amazing products..."
              : `${products.length} stunning item${products.length !== 1 ? "s" : ""} found`}
          </div>
        </div>

        {/* Featured / all products grid */}
        <div className="mt-8">
          {isLoading ? (
            <Loading />
          ) : products.length === 0 ? (
            <div className="text-center text-pink-700 mt-16 py-16 bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl">
              <div className="text-8xl mb-6">🔍</div>
              <p className="text-2xl font-bold mb-2">No products available</p>
              <p className="text-lg">
                Something went wrong or no products were returned. Please try again
                later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mt-6">
              {products.map((p) => (
                <ProductCard key={p.productId || p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer unchanged */}
      <footer className="mt-2 bg-gradient-to-br from-pink-50 via-white to-pink-100 text-pink-700 pt-16 pb-10 relative overflow-hidden border-t-2 border-pink-300 shadow-inner shadow-pink-200">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100 to-white"></div>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-pink-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                filter: "blur(2px)",
                opacity: 0.5,
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 mb-4 animate-glow">
              Crystal Bloom
            </h4>
            <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full mb-4 shadow-lg"></div>
            <p className="text-base leading-relaxed">
              Premium makeup & beauty essentials. Glow with confidence every day and
              embrace your natural radiance.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-4 text-pink-700">Shop</h5>
            <ul className="space-y-3 text-base">
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors duration-300 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-pink-600 transition-colors duration-300 hover:translate-x-1 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-pink-600 transition-colors duration-300 hover:translate-x-1 inline-block">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-pink-600 transition-colors duration-300 hover:translate-x-1 inline-block">
                  Collections
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-4 text-pink-700">Contact</h5>
            <ul className="space-y-3 text-base">
              <li>Email: support@crystalbloom.com</li>
              <li>Phone: +94 70 406 8597</li>
              <li>Address: Colombo, Sri Lanka</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-4 text-pink-700">Stay in Touch</h5>
            <form className="flex flex-col gap-4 max-w-xs">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-full border-2 border-pink-300 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-700 placeholder-pink-400 bg-white/90 backdrop-blur-sm"
                aria-label="Subscribe email input"
              />
              <button
                type="submit"
                className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-pink-400"
                aria-label="Subscribe button"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 text-center border-t-2 border-pink-300 bg-white/60 backdrop-blur-md shadow-inner shadow-pink-200 py-2">
          <p className="text-base text-pink-600 font-medium">
            &copy; {new Date().getFullYear()} Crystal Bloom. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 8px #f9a8d4, 0 0 15px #ec4899;
          }
          50% {
            text-shadow: 0 0 15px #f9a8d4, 0 0 30px #ec4899;
          }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
