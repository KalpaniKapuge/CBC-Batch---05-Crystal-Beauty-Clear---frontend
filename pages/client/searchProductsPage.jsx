import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard.jsx";
import toast from "react-hot-toast";

// Assume Loading is defined elsewhere; fallback simple spinner if not
function Loading() {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
    </div>
  );
}

export default function SearchProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isLoading) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((res) => {
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          toast.error("Error fetching products");
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  const handleSearchChange = async (e) => {
    const q = e.target.value;
    setQuery(q);
    setIsLoading(true);

    if (q.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/search/${encodeURIComponent(
          q
        )}`
      );
      setProducts(response.data);
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl mb-6">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full px-4 py-3 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm text-base"
          value={query}
          onChange={handleSearchChange}
        />
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-4">
        {query.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Please enter a search query
          </div>
        ) : isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.productId || product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
