/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import axios from "@/utils/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const categories = [
  "All",
  "Clothing",
  "Coffee",
  "Food",
  "Furniture",
  "Headphones",
  "Laptop",
  "Pet supplies",
  "Smartphones",
  "Toys",
  "Wearables",
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "newest", label: "Newest" },
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("searchTerm") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("relevance");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  let debounceTimeout: NodeJS.Timeout;

  // Fetch suggestions as user types
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      try {
        const res = await axios.get("/api/products/search", {
          params: { q: query, limit: 5, suggest: true },
        });
        setSuggestions(res.data.products || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);
    return () => clearTimeout(debounceTimeout);
    // eslint-disable-next-line
  }, [query]);

  // Helper to parse price string like '53$' to number
  function parsePrice(price: string | number) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return Number(String(price).replace(/[^\d.]/g, ''));
  }

  // Fetch products
  useEffect(() => {
    // If search box is empty AND category is All, do not fetch, just show message
    if (!query.trim() && (!category || category === "All")) {
      setProducts([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          q: query,
          category: category !== "All" ? category : undefined,
          sort,
          page,
          rating: rating > 0 ? rating : undefined,
        };
        // Don't send minPrice/maxPrice to backend
        const res = await axios.get("/api/products/search", { params });
        let fetched = res.data.products || [];
        // Client-side price filtering
        if (minPrice) {
          fetched = fetched.filter((p: any) => parsePrice(p.price) >= Number(minPrice));
        }
        if (maxPrice) {
          fetched = fetched.filter((p: any) => parsePrice(p.price) <= Number(maxPrice));
        }
        setProducts(fetched);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line
  }, [query, category, minPrice, maxPrice, sort, page, rating]);

  // Update URL on filter/search change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("searchTerm", query);
    if (category && category !== "All") params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort && sort !== "relevance") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    router.replace(`/search?${params.toString()}`);
    // eslint-disable-next-line
  }, [query, category, minPrice, maxPrice, sort, page]);

  // Hide suggestions on blur, scroll, or click outside
  useEffect(() => {
    const handleBlur = (e: FocusEvent) => {
      if (
        inputRef.current &&
        e.target !== inputRef.current &&
        !inputRef.current.contains(e.relatedTarget as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    const handleScroll = () => setShowSuggestions(false);
    const handleClick = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("mousedown", handleClick);
    if (inputRef.current) {
      inputRef.current.addEventListener("blur", handleBlur);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("mousedown", handleClick);
      if (inputRef.current) {
        inputRef.current.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col pt-20 md:pt-24">
      {/* Search input and suggestions (no sticky bar) */}
      <div className="w-full max-w-xl mx-auto px-2 md:px-0 mb-4 relative">
        <form onSubmit={handleSearch} className="flex gap-2 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-full focus:ring-2 focus:ring-[#00ffff] w-full"
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            autoComplete="off"
          />
          <Button type="submit" className="bg-[#00ffff] text-gray-900 font-bold hover:bg-[#00cccc] rounded-full px-6">Search</Button>
          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 top-12 w-full max-w-lg mx-auto bg-gray-800 rounded-xl shadow-2xl z-50 border border-gray-700 overflow-y-auto max-h-72"
                style={{ pointerEvents: 'auto' }}
              >
                {suggestions.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[#00ffff20] cursor-pointer transition"
                    onMouseDown={() => {
                      setShowSuggestions(false);
                      router.push(`/product/${s._id}`);
                    }}
                  >
                    <img src={s.image} alt={s.title} className="w-9 h-9 object-contain rounded bg-gray-700" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#00ffff] truncate">{s.title}</div>
                      <div className="text-xs text-gray-400 truncate">{s.price} {s.category && `| ${s.category}`}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
      {/* Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 px-2 md:px-4 py-4 bg-gray-900 border-b border-gray-800 w-full max-w-7xl mx-auto">
        <div className="flex gap-4 items-center flex-wrap w-full justify-center md:justify-start">
          <div className="min-w-[120px]">
            <label className="block text-xs mb-1 text-[#00ffff] font-bold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white rounded px-2 py-1 w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-end">
            <div className="min-w-[90px]">
              <label className="block text-xs mb-1 text-[#00ffff] font-bold">Min Price</label>
              <Input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="min-w-[90px]">
              <label className="block text-xs mb-1 text-[#00ffff] font-bold">Max Price</label>
              <Input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-xs mb-1 text-[#00ffff] font-bold">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white rounded px-2 py-1 w-full"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center min-w-[120px]">
            <label className="block text-xs mb-1 text-[#00ffff] font-bold">Min Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  className={`p-1 ${rating >= star ? "text-yellow-400" : "text-gray-500"}`}
                  onClick={() => setRating(star)}
                  type="button"
                  aria-label={`Min rating ${star}`}
                >
                  <Star size={18} fill={rating >= star ? "#facc15" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <Button
            type="button"
            className="bg-gray-700 text-[#00ffff] border border-[#00ffff] hover:bg-[#00ffff] hover:text-gray-900 font-bold rounded-full px-6 ml-2 mt-4 md:mt-0"
            onClick={() => {
              // Only reset filters, not the search box
              setCategory("All");
              setMinPrice("");
              setMaxPrice("");
              setSort("relevance");
              setRating(0);
              setPage(1);
            }}
            aria-label="Clear all filters"
          >
            Clear All
          </Button>
        </div>
      </div>
      {/* Results */}
      <section className="flex-1 px-2 md:px-4 py-8 w-full max-w-7xl mx-auto">
        {(!query.trim() && (!category || category === "All")) ? (
          <motion.div className="flex justify-center items-center h-64" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-[#00ffff] text-xl font-bold">Your search box is empty.</span>
          </motion.div>
        ) : loading ? (
          <motion.div className="flex justify-center items-center h-64" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-[#00ffff] text-xl font-bold animate-pulse">Loading...</span>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div className="flex justify-center items-center h-64" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-[#00ffff] text-xl font-bold">No products found.</span>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              {products.map((product) => (
                <ProductCard key={product._id} {...product} />
              ))}
            </motion.div>
            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  className={`rounded-full px-4 ${p === page ? "bg-[#00ffff] text-gray-900 font-bold" : "bg-gray-800 text-[#00ffff] border-[#00ffff]"}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300">Loading search...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
