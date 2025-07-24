/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;
const FETCH_SIZE = 1000; // Fetch a large pool for true randomization

const ProductsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure hydration is complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    // Deterministic shuffle function based on seed
    const deterministicShuffle = (array: any[], seed: number) => {
      const shuffled = [...array];
      let currentIndex = shuffled.length;
      let randomIndex;

      // Simple seeded random number generator
      const seededRandom = (seedValue: number) => {
        const x = Math.sin(seedValue) * 10000;
        return x - Math.floor(x);
      };

      while (currentIndex !== 0) {
        randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
        currentIndex--;
        [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
      }

      return shuffled;
    };
    
    setLoading(true);
    axiosInstance
      .get(`/api/products?page=1&limit=${FETCH_SIZE}`)
      .then((res) => {
        const allProds = res.data.products || [];
        
        // Use deterministic shuffle with a daily seed for consistency
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const shuffled = deterministicShuffle(allProds, seed);
        
        // Paginate in frontend
        const startIdx = (page - 1) * PAGE_SIZE;
        const paginated = shuffled.slice(startIdx, startIdx + PAGE_SIZE);
        setProducts(paginated);
        setTotalPages(Math.ceil(shuffled.length / PAGE_SIZE));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, isHydrated]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/products?page=${newPage}`);
  };

  // Advanced pagination logic
  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 2; // Show current ±2
    let start = Math.max(1, page - windowSize);
    let end = Math.min(totalPages, page + windowSize);
    if (page <= windowSize + 2) {
      end = Math.min(totalPages, 1 + 2 * windowSize + 1);
    }
    if (page >= totalPages - windowSize - 1) {
      start = Math.max(1, totalPages - 2 * windowSize - 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-w-6xl mt-10 mx-auto pt-8 px-2 sm:px-4 min-h-screen w-full">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mb-6">All Products</h1>
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-cyan-400 text-xl font-bold animate-pulse">Loading products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-gray-400 text-center py-10">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {products.map((product: any) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      <nav className="flex flex-wrap justify-center items-center gap-2 mt-8 select-none">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded disabled:opacity-50 min-w-[40px] cursor-pointer"
        >
          Prev
        </Button>
        {/* First page */}
        {page > 3 && (
          <Button
            onClick={() => handlePageChange(1)}
            className={`px-3 py-2 rounded min-w-[40px] cursor-pointer ${page === 1 ? 'bg-cyan-700 text-white' : 'bg-gray-800 text-cyan-300 hover:bg-cyan-900'}`}
          >
            1
          </Button>
        )}
        {/* Ellipsis before */}
        {page > 4 && <span className="px-2 text-cyan-400">...</span>}
        {/* Page numbers */}
        {getPageNumbers().map((num) => (
          <Button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-2 rounded min-w-[40px] cursor-pointer ${num === page ? 'bg-[#00ffff] text-black font-extrabold shadow-lg ring-2 ring-[#00ffff] scale-110' : 'bg-gray-800 text-cyan-300 hover:bg-cyan-900'}`}
            disabled={num === page}
          >
            {num}
          </Button>
        ))}
        {/* Ellipsis after */}
        {page < totalPages - 3 && <span className="px-2 text-cyan-400">...</span>}
        {/* Last page */}
        {page < totalPages - 2 && (
          <Button
            onClick={() => handlePageChange(totalPages)}
            className={`px-3 py-2 rounded min-w-[40px] cursor-pointer ${page === totalPages ? 'bg-cyan-700 text-white' : 'bg-gray-800 text-cyan-300 hover:bg-cyan-900'}`}
          >
            {totalPages}
          </Button>
        )}
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded disabled:opacity-50 min-w-[40px] cursor-pointer"
        >
          Next
        </Button>
      </nav>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300">Loading products...</div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
};

export default ProductsPage;
