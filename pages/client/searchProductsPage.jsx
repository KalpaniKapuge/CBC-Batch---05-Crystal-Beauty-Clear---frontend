import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import ProductCard from "../../src/components/productCard.jsx";
import toast from "react-hot-toast";

function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}

function Loading() {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
    </div>
  );
}

export default function SearchProductPage() {
  const queryParam = useQueryParam();
  const q = queryParam.get("query") || "";

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(q));
  const [query, setQuery] = useState(q);
  const debounceRef = useRef(null);
  const cancelTokenRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (cancelTokenRef.current) cancelTokenRef.current.cancel("Component unmounted");
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const performSearch = async (term) => {
    if (cancelTokenRef.current) {
      try {
        cancelTokenRef.current.cancel("New request initiated");
      } catch {}
    }
    cancelTokenRef.current = axios.CancelToken.source();
    if (!isMountedRef.current) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/search/${encodeURIComponent(term)}`,
        { cancelToken: cancelTokenRef.current.token }
      );
      if (isMountedRef.current) setProducts(response.data || []);
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (isMountedRef.current)
        toast.error(
          error.response?.data?.message
            ? `Search failed: ${error.response.data.message}`
            : "Error fetching products"
        );
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  // initial search if query exists
  useEffect(() => {
    if (q.trim().length > 0) {
      performSearch(q.trim());
    } else {
      setProducts([]);
      setIsLoading(false);
    }
    setQuery(q);
  }, [q]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (val.trim().length === 0) {
        setProducts([]);
        if (isMountedRef.current) setIsLoading(false);
        return;
      }
      performSearch(val.trim());
    }, 300);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm text-base"
            value={query}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`/search-products?query=${encodeURIComponent(query.trim())}`}
            className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full shadow transition"
          >
            Search
          </Link>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-4">
        {query.trim().length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Please enter a search query
          </div>
        ) : isLoading ? (
          <Loading />
        ) : (
          <>
            {products.length === 0 && (
              <div className="col-span-full text-center text-gray-500 mb-6">
                No products found for "{query}"
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.productId || product._id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
