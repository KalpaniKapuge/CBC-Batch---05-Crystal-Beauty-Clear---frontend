import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../src/components/productCard.jsx";

function Loading() {
  return (
    <div className="w-full flex justify-center py-16">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent absolute top-0 left-0"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Fetch products and categories
  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );

        if (isMountedRef.current) {
          const fetchedProducts = productRes.data || [];
          setProducts(fetchedProducts);

          // Create categories based on product name 
          const uniqueCategories = [
            "all",
            ...new Set(
              fetchedProducts
                .map((p) =>
                  p.name ? p.name.trim().toLowerCase() : null
                )
                .filter(Boolean)
            ),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        if (isMountedRef.current) {
          toast.error(
            error.response?.data?.message || "Error fetching products"
          );
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  //  Filter products by category + search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : p.name &&
          p.name.trim().toLowerCase() === selectedCategory;

    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative">
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 mb-4">
            Shop Our Collection
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium products crafted with care and find your perfect match
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Panel */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 sticky top-6">
              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Categories</h2>
              </div>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category
                          ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                          : "text-gray-700 hover:bg-pink-100 hover:text-pink-600 border border-transparent hover:border-pink-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {category === "all"
                            ? "All Products"
                            : category.charAt(0).toUpperCase() +
                              category.slice(1)}
                        </span>
                        {selectedCategory === category && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full lg:w-3/4">
            {isLoading ? (
              <Loading />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 px-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Try another category or clear the search box.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.productId || product._id}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
