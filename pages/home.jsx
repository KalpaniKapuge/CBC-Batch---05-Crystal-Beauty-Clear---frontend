import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductCard from "../src/components/productCard.jsx";
import { useProductSearch } from "../hooks/useProductSearch.jsx";
import toast from "react-hot-toast";

// Import carousel images from src/assets (make sure these files exist)
import c1 from "../assets/c1.png";
import c2 from "../assets/c2.jpg";
import c3 from "../assets/c3.png";

const carouselSlides = [
  {
    id: 1,
    title: "Radiant Summer Glow",
    subtitle: "Fresh makeup for sunny days.",
    image: c1,
    cta: "Shop Now",
    link: "/",
  },
  {
    id: 2,
    title: "Bold & Beautiful Lips",
    subtitle: "Colors that speak louder.",
    image: c2,
    cta: "Explore",
    link: "/",
  },
  {
    id: 3,
    title: "Limited Edition Set",
    subtitle: "Glow like never before.",
    image: c3,
    cta: "Buy Now",
    link: "/",
  },
];

function Carousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIndex((i) => (i + 1) % carouselSlides.length), 5000);
    return () => clearInterval(iv);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
  const next = () => setIndex((i) => (i + 1) % carouselSlides.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl mt-10">
      {carouselSlides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="h-64 md:h-96 bg-cover bg-center flex items-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="bg-white/75 backdrop-blur-md rounded-xl p-6 ml-6 max-w-md">
              <h2 className="text-3xl font-bold text-pink-700 mb-2">{slide.title}</h2>
              <p className="text-gray-700 mb-4">{slide.subtitle}</p>
              <Link
                to={slide.link}
                className="inline-block px-5 py-2 bg-pink-600 text-white rounded-full font-semibold hover:brightness-105 transition"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:scale-105 transition"
      >
        <FaChevronLeft />
      </button>
      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:scale-105 transition"
      >
        <FaChevronRight />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-pink-600" : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
    </div>
  );
}

export default function HomePage() {
  const { filtered, query, setSearchQuery, isLoading } = useProductSearch("");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-pink-600">
            Welcome to Crystal Bloom
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover beauty essentials crafted to make you shine.
          </p>
        </div>

        {/* Reused search bar (styled) */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-2xl flex items-center gap-2 shadow-md rounded-full overflow-hidden border border-pink-200">
            <input
              type="text"
              placeholder="Search makeup, skincare, collections..."
              value={query}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
              className="flex-1 px-6 py-3 outline-none text-gray-700 bg-white"
            />
            <button
              type="button"
              className="flex items-center gap-2 bg-pink-600 px-5 py-3 text-white font-semibold rounded-r-full hover:brightness-105 transition"
              onClick={() => {
                if (query.trim() !== "") setSearchQuery(query);
              }}
            >
              <BsSearch size={18} />
              Search
            </button>
          </div>
        </div>

        <Carousel />

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <div className="text-sm text-gray-500">
            {isLoading ? "Loading..." : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <Loading />
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              No results for "{query}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filtered.map((p) => (
                <ProductCard key={p.productId || p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-pink-50 text-gray-700 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-xl font-bold text-pink-700 mb-3">Crystal Bloom</h4>
            <p className="text-sm">
              Premium makeup & beauty essentials. Glow with confidence every day.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Shop</h5>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/" className="hover:text-pink-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-pink-600">
                  About
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-pink-600">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-pink-600">
                  Collections
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Support</h5>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/help" className="hover:text-pink-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-pink-600">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-pink-600">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Stay in touch</h5>
            <p className="text-sm mb-2">
              Subscribe to our newsletter for exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                aria-label="Email"
                type="email"
                placeholder="you@example.com"
                className="flex-1 px-4 py-2 rounded-full border border-pink-200 focus:outline-none"
              />
              <button className="px-5 py-2 bg-pink-600 text-white rounded-full font-semibold hover:brightness-105 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-pink-200 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Crystal Bloom. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
