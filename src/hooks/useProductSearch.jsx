import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function useProductSearch(initialQuery = "") {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);

  const debounceRef = useRef(null);
  const cancelTokenRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchAll = async () => {
      if (!isMountedRef.current) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        if (isMountedRef.current) {
          setProducts(res.data || []);
          setFiltered(res.data || []);
        }
      } catch (err) {
        if (isMountedRef.current) {
          toast.error(err.response?.data?.message || "Failed to load products");
        }
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    fetchAll();
    return () => {
      isMountedRef.current = false;
      if (cancelTokenRef.current) cancelTokenRef.current.cancel();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const performSearch = async (q) => {
    if (cancelTokenRef.current) {
      try {
        cancelTokenRef.current.cancel("new search");
      } catch {}
    }
    cancelTokenRef.current = axios.CancelToken.source();
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/search/${encodeURIComponent(q)}`,
        { cancelToken: cancelTokenRef.current.token }
      );
      if (isMountedRef.current) setFiltered(res.data || []);
    } catch (err) {
      if (!axios.isCancel(err) && isMountedRef.current) {
        toast.error(err.response?.data?.message || "Search failed");
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  const setSearchQuery = (q) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (q.trim() === "") {
        setFiltered(products);
      } else {
        performSearch(q.trim());
      }
    }, 300);
  };

  return {
    products,
    filtered,
    query,
    setSearchQuery,
    isLoading,
  };
}
