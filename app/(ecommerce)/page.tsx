"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CatalogPage from "../../components/ProductCatalog"; // <-- Import your catalog page

const banners = [
  {
    id: 1,
    image: "/banner3.webp",
    title: "Welcome to Our Store",
    description: "Discover the latest products and offers.",
    link: "/products",
  },
  {
    id: 2,
    image: "/banner4.webp",
    title: "Summer Sale",
    description: "Up to 50% off on selected items.",
    link: "/products",
  },
  {
    id: 3,
    image: "/banner1.webp",
    title: "New Arrivals",
    description: "Check out our new collection.",
    link: "/products",
  },
  {
    id: 4,
    image: "/banner5.webp",
    title: "Free Shipping",
    description: "On orders over $50.",
    link: "/products",
  },
];

const AUTO_PLAY_INTERVAL = 5000; // ms

const Page = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Auto-play logic
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current]);

  // Manual navigation resets timer
  const goTo = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const prev = () => goTo((current - 1 + banners.length) % banners.length);
  const next = () => goTo((current + 1) % banners.length);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8 pt-16">
        <section className="mb-12">
          <motion.div
            className="relative overflow-hidden rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={banners[current].id}
                className="relative w-full h-[400px] flex items-center justify-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                style={{
                  backgroundImage: `url(${banners[current].image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Mask only on the first banner */}
                {current === 0 && (
                  <div className="absolute inset-0 bg-black/50 z-0" />
                )}
                {/* Content */}
                <div className="relative z-10 bg-black/40 p-8 rounded-lg text-center max-w-lg mx-auto">
                  <h2 className="text-3xl font-bold mb-2 text-[#00ffff]">
                    {banners[current].title}
                  </h2>
                  <p className="mb-4">{banners[current].description}</p>
                  <a
                    href={banners[current].link}
                    className="inline-block px-6 py-2 bg-[#00ffff] text-gray-900 font-semibold rounded hover:bg-[#00cccc] transition"
                  >
                    Shop Now
                  </a>
                </div>
                {/* Left Arrow */}
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#00ffff]/80 text-white hover:text-gray-900 p-2 rounded-full transition"
                  aria-label="Previous banner"
                >
                  <FaChevronLeft />
                </button>
                {/* Right Arrow */}
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#00ffff]/80 text-white hover:text-gray-900 p-2 rounded-full transition"
                  aria-label="Next banner"
                >
                  <FaChevronRight />
                </button>
              </motion.div>
            </AnimatePresence>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
              {banners.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="w-2 h-2 rounded-full border-none outline-none bg-gray-500/60"
                  aria-label={`Go to banner ${idx + 1}`}
                  whileTap={{ scale: 1.3 }}
                  animate={
                    idx === current
                      ? {
                          scale: 1.5,
                          backgroundColor: "#00ffff",
                          boxShadow: "0 0 8px #00ffff80",
                        }
                      : {
                          scale: 1,
                          backgroundColor: "rgba(107,114,128,0.6)",
                          boxShadow: "0 0 0 transparent",
                        }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{
                    border:
                      idx === current
                        ? "1.5px solid #00ffff"
                        : "1.5px solid transparent",
                    margin: "0 3px",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>
         <CatalogPage />
      </main>
    </div>

  );
};

export default Page;
