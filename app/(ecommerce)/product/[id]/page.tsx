/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from "react-icons/fa";
import SignInModal from "@/components/SignInModal";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const demoReviews = [
  { user: "Alice", rating: 5, comment: "Great product! Highly recommend." },
  { user: "Bob", rating: 4, comment: "Good value for the price." },
  { user: "Charlie", rating: 3, comment: "It's okay, does the job." },
];

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isWished, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance.get(`/api/products/${id}`)
      .then(res => {
  setProduct(res.data);
        if (res.data.category) {
          axiosInstance.get(`/api/products?limit=1000`).then((allRes) => {
            const allProducts = allRes.data.products.filter((p: any) => p._id !== res.data._id);
            const sameCat = allProducts.filter((p: any) => p.category === res.data.category);
            const diffCatArr = allProducts.filter((p: any) => p.category !== res.data.category);
            // Shuffle and pick up to 2 random from same category
            const shuffledSame = sameCat.sort(() => 0.5 - Math.random());
            const selectedSameFinal = shuffledSame.slice(0, 2);
            // selectedSameFinal computed
            // Pick 1 random from a different category
            let diffCatFinal = null;
            if (diffCatArr.length > 0) {
              const shuffledDiff = diffCatArr.sort(() => 0.5 - Math.random());
              diffCatFinal = shuffledDiff.find((p: any) => !selectedSameFinal.some((s: any) => s._id === p._id));
              // selected different category computed
            } else {
              // no different category products available
            }
            let relatedArr = diffCatFinal ? [...selectedSameFinal, diffCatFinal] : selectedSameFinal;
            // Remove any accidental duplicates (shouldn't happen, but for safety)
            relatedArr = relatedArr.filter((p: any, idx: number, arr: any[]) => arr.findIndex((x: any) => x._id === p._id) === idx);
            // final related products ready
            setRelated(relatedArr);
          }).catch((err) => {
            console.error("Error fetching related products:", err?.message || err);
            setRelated([]);
          });
        } else {
          // no category for current product
          setRelated([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err?.message || err);
        setProduct(null)
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${product._id}&qty=${quantity}`);
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowSignIn(true);
      return;
    }
    addToCart(product._id, quantity);
    toast.success(`Added '${product.title}' to cart!`);
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      setShowSignIn(true);
      return;
    }
    try {
      if (!isWished(product._id)) {
        await addToWishlist(product._id);
        toast.success("Added to wishlist!");
      } else {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist!");
      }
    } catch {
      toast.error("Wishlist action failed.");
    }
  };

  const priceDisplay = (price: any) => {
    if (typeof price === "number") return `$${price.toFixed(2)}`;
    if (typeof price === "string") {
      const cleaned = price.replace(/[^\d.]/g, "");
      if (!isNaN(Number(cleaned)) && cleaned !== "") return `$${Number(cleaned).toFixed(2)}`;
    }
    return "$0.00";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-cyan-400 text-xl font-bold animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-pink-400 text-xl font-bold">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 px-2 sm:px-4 min-h-screen w-full">
      <button
        className="mb-4 mt-16 sm:mt-0 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-lg z-10 relative"
        style={{ marginTop: 'max(env(safe-area-inset-top, 1.5rem), 4.5rem)' }}
        onClick={() => router.back()}
      >
        <FaArrowLeft /> Back
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={product._id}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-cyan-400/40 flex flex-col md:flex-row gap-6 md:gap-8 p-3 sm:p-6 md:p-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image + Wishlist */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <motion.div
              layout
              className="w-full max-w-xs sm:max-w-sm aspect-square bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border-2 border-cyan-400/30 shadow-lg group relative"
              whileHover={{ scale: 1.04 }}
            >
              <Image
                src={product.image || "/default-product.png"}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                onClick={() => window.open(product.image || "/default-product.png", "_blank")}
                priority
              />
            </motion.div>
            <motion.button
              layout
              className="mt-4 flex items-center gap-2 bg-gray-800 hover:bg-pink-600 text-pink-400 border border-pink-400 rounded px-4 py-2 font-bold shadow w-full max-w-xs justify-center"
              onClick={handleAddToWishlist}
              whileTap={{ scale: 0.97 }}
            >
              <FaHeart /> {isWished(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </motion.button>
          </div>
          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-center gap-3 w-full">
            <motion.h1 layout className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mb-1 break-words">{product.title}</motion.h1>
            <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-1">
              {priceDisplay(product.price)}
            </div>
            {/* Stock status */}
            <div className="mb-1">
              {product.inventory > 0 ? (
                <span className="text-green-400 font-bold">In Stock</span>
              ) : (
                <span className="text-red-400 font-bold">Out of Stock</span>
              )}
            </div>
            {/* Brand, Index, Meta */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-1">
              {product.brand && <span>Brand: <span className="text-cyan-300">{product.brand}</span></span>}
              {typeof product.index !== "undefined" && <span>Index: <span className="text-cyan-300">{product.index}</span></span>}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
              {product.updatedAt && <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>}
            </div>
            {/* Category, Currency */}
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-gray-800 text-cyan-300 rounded-full px-3 py-1 text-xs sm:text-sm font-bold border border-cyan-400/30">
                {product.category}
              </span>
              {product.currency && (
                <span className="bg-gray-800 text-pink-300 rounded-full px-3 py-1 text-xs sm:text-sm font-bold border border-pink-400/30">
                  {product.currency}
                </span>
              )}
            </div>
            {/* Quantity selector */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-gray-300 font-bold">Qty:</span>
              <input
                type="number"
                min={1}
                max={product.inventory || 99}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.inventory || 99)))}
                className="w-16 px-2 py-1 rounded border border-cyan-400 bg-gray-900 text-cyan-200 font-bold text-lg focus:outline-none"
              />
            </div>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-3 w-full">
              <motion.button
                layout
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded px-4 py-2 font-bold text-base sm:text-lg shadow flex items-center justify-center w-full sm:w-auto"
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
              >
                <FaShoppingCart className="inline mr-2" /> Add to Cart
              </motion.button>
              <motion.button
                layout
                className="bg-pink-500 hover:bg-pink-600 text-white rounded px-4 py-2 font-bold text-base sm:text-lg shadow flex items-center justify-center w-full sm:w-auto"
                onClick={handleBuyNow}
                whileTap={{ scale: 0.97 }}
              >
                Buy Now
              </motion.button>
            </div>
            {/* Payment methods */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-gray-400 font-bold text-xs sm:text-sm">We accept:</span>
              <FaCcVisa className="text-blue-400 text-xl sm:text-2xl" />
              <FaCcMastercard className="text-red-400 text-xl sm:text-2xl" />
              <FaCcPaypal className="text-blue-300 text-xl sm:text-2xl" />
              <FaCcAmex className="text-indigo-300 text-xl sm:text-2xl" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Tabs for Description, Details, Shipping, Reviews */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product._id + "-tabs"}
          className="mt-8 bg-gray-900 rounded-xl shadow-lg border border-cyan-400/20 p-3 sm:p-6 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="description">
            <TabsList
              className="flex flex-wrap gap-2 sm:gap-4 border-b border-cyan-400/10 mb-4 bg-gray-800/80 rounded-lg px-1 py-1 sm:px-2 sm:py-2"
            >
              <TabsTrigger value="description" className="px-4 py-2 sm:px-6 sm:py-3 font-bold text-cyan-300 cursor-pointer rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 data-[state=active]:bg-cyan-900/60 data-[state=active]:text-white data-[state=active]:shadow">
                Description
              </TabsTrigger>
              <TabsTrigger value="details" className="px-4 py-2 sm:px-6 sm:py-3 font-bold text-cyan-300 cursor-pointer rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 data-[state=active]:bg-cyan-900/60 data-[state=active]:text-white data-[state=active]:shadow">
                Details
              </TabsTrigger>
              <TabsTrigger value="shipping" className="px-4 py-2 sm:px-6 sm:py-3 font-bold text-cyan-300 cursor-pointer rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 data-[state=active]:bg-cyan-900/60 data-[state=active]:text-white data-[state=active]:shadow">
                Shipping
              </TabsTrigger>
              <TabsTrigger value="reviews" className="px-4 py-2 sm:px-6 sm:py-3 font-bold text-cyan-300 cursor-pointer rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 data-[state=active]:bg-cyan-900/60 data-[state=active]:text-white data-[state=active]:shadow">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <div className="text-gray-300 whitespace-pre-line">{product.description || "No description available."}</div>
            </TabsContent>
            <TabsContent value="details">
              <ul className="text-gray-300 text-sm space-y-2">
                <li><b>Brand:</b> {product.brand || "-"}</li>
                <li><b>Description:</b> {product.description || "-"}</li>
                <li><b>Index:</b> {typeof product.index !== "undefined" ? product.index : "-"}</li>
                <li><b>Updated:</b> {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "-"}</li>
                <li><b>Category:</b> {product.category || "-"}</li>
                <li><b>Currency:</b> {product.currency || "-"}</li>
                <li><b>Stock:</b> {product.inventory > 0 ? "In Stock" : "Out of Stock"}</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping">
              <div className="text-gray-300 text-sm">
                <p><b>Estimated Delivery:</b> 3-7 business days</p>
                <p><b>Shipping Cost:</b> ${product && Number(product.price) < 100 ? 15 : 30}</p>
                <p><b>Return Policy:</b> 30-day hassle-free returns</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-4">
                {demoReviews.map((r, i) => (
                  <motion.div key={i} className="bg-gray-800 rounded p-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-cyan-300">{r.user}</span>
                      <span className="text-yellow-400">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <div className="text-gray-300">{r.comment}</div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
      {/* Related Products */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product._id + "-related"}
          className="mt-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-4">You may also like</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {related.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 col-span-3">No related products found.</div>
            ) : null}
            {related.length > 0 && related.map((p: any) => (
              <div
                key={p._id}
                className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center text-gray-300 cursor-pointer hover:bg-cyan-900/30 transition border-2 border-transparent hover:border-cyan-400"
                onClick={() => router.push(`/product/${p._id}`)}
                title={p.title}
              >
                <Image src={p.image || "/default-product.png"} alt={p.title} width={120} height={120} className="w-24 h-24 object-contain mb-2 rounded" />
                <div className="font-bold text-center line-clamp-2 mb-1">{p.title}</div>
                <div className="text-cyan-300 font-bold">{priceDisplay(p.price)}</div>
                <div className="text-xs text-gray-400 mt-1">{p.category}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <SignInModal
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={() => {
          setShowSignIn(false);
          router.push("/auth?type=login");
        }}
      />
    </div>
  );
};

export default ProductPage;
