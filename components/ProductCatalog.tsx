/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import axios from "@/utils/axiosInstance";

const MAX_PRODUCTS_PER_CATEGORY = 6;
const PAGE_SIZE = 1000; // Fetch all for home page

function pickRandomItems<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr;  
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
function groupByCategory(products: any[]) {
  return products.reduce((acc, product) => {
    const cat = product.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, any[]>);
}

const CatalogPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/api/products?page=1&limit=${PAGE_SIZE}`)
      .then((res) => {
        // Defensive: handle both array and object response
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Track window width for responsive logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const grouped = useMemo(() => groupByCategory(products), [products]);

  // Memoize visible items per category so random picks are stable until products/windowWidth changes
  const visibleItemsByCategory = useMemo(() => {
    const result: Record<string, any[]> = {};
    Object.entries(grouped).forEach(([category, items]) => {
      const itemsArray = items as any[];
      if (windowWidth < 640) {
        result[category] = pickRandomItems(itemsArray, 2);
      } else if (windowWidth < 1024) {
        result[category] = itemsArray.slice(0, 2);
      } else {
        result[category] = itemsArray.slice(0, MAX_PRODUCTS_PER_CATEGORY);
      }
    });
    return result;
  }, [grouped, windowWidth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
        <AnimatePresence>
          <motion.div
            key="skeleton"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gray-800 dark:bg-gray-800 light:bg-card rounded-xl shadow-lg p-4 animate-pulse h-[340px] border border-gray-700 dark:border-gray-700 light:border-border"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="w-full h-48 bg-gray-700 dark:bg-gray-700 light:bg-muted rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-700 dark:bg-gray-700 light:bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 dark:bg-gray-700 light:bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-700 dark:bg-gray-700 light:bg-muted rounded w-1/3"></div>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-blue-500">
        <p className="text-2xl font-bold">No products found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 relative">
      {/* Explore All Products button at the top */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => window.location.href = '/products'}
          className="px-8 py-3 rounded-full bg-[#00ffff] dark:bg-[#00ffff] light:bg-primary text-gray-900 dark:text-gray-900 light:text-primary-foreground font-extrabold text-lg shadow-lg border-2 border-[#00ffff] dark:border-[#00ffff] light:border-primary hover:bg-[#00cccc] dark:hover:bg-[#00cccc] light:hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#00ffff80] dark:focus:ring-[#00ffff80] light:focus:ring-primary/50 animate-pulse"
          style={{ boxShadow: '0 0 24px #00ffff80' }}
        >
          Explore All Products
        </button>
      </div>
      {Object.entries(grouped).map(([category, items], i, arr) => {
        const visibleItems = visibleItemsByCategory[category];
        const itemsArray = items as any[];
        const extraCount = itemsArray.length - visibleItems.length;
        return (
          <section key={category} className="mb-12">
            <h2 className="flex items-center text-lg sm:text-xl md:text-2xl font-bold mb-4">
              <span className="inline-block w-2 h-8 bg-primary rounded-l-md mr-3 shadow-lg"></span>
              <span className="bg-card/80 px-4 py-2 rounded-md shadow text-primary tracking-wide border border-border">
                {category}
              </span>
            </h2>
            <div
              className={
                windowWidth < 640
                  ? "grid grid-cols-1 gap-6"
                  : windowWidth < 1024
                  ? "grid grid-cols-2 gap-6"
                  : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
              }
            >
              {visibleItems.map((product, idx) => {
                const isLast = idx === visibleItems.length - 1 && extraCount > 0;
                return (
                  <div key={product._id || idx} className="relative">
                    <ProductCard
                      _id={product._id}
                      title={product.title}
                      price={product.price}
                      image={product.image}
                      description={product.description}
                      category={product.category}
                      rating={product.rating}
                    />
                    {isLast && (
                      <button
                        className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl text-3xl font-bold text-primary hover:bg-primary/30 transition cursor-pointer border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = '/products';
                        }}
                        aria-label="See all products"
                        tabIndex={0}
                      >
                        +{extraCount}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Divider between categories except last */}
            {i < arr.length - 1 && (
              <div className="my-8 border-b border-gray-800 opacity-60" aria-hidden="true"></div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default CatalogPage;