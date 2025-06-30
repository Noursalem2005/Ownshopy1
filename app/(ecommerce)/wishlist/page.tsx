/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Masonry from "react-masonry-css";
import { useRouter } from "next/navigation";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  // Fetch wishlist products on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      setWishlistLoading(true);
      try {
        const res = await axiosInstance.get("/api/profile/wishlist");
        setWishlist(res.data.wishlist || []);
      } catch {
        setWishlist([]);
      }
      setWishlistLoading(false);
    };
    fetchWishlist();
  }, []); 
  // Drag-and-drop logic
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = wishlist.findIndex(item => item._id === active.id);
      const newIndex = wishlist.findIndex(item => item._id === over.id);
      const newOrder = arrayMove(wishlist, oldIndex, newIndex);
      setWishlist(newOrder);
      // Send new order to backend
      await axiosInstance.patch("/api/profile/wishlist/reorder", {
        newOrder: newOrder.map(item => item._id)
      });
    }
  };

  const priceDisplay = (price: any) => {
    if (typeof price === "number") return `$${price.toFixed(2)}`;
    if (typeof price === "string") {
      // Remove any non-numeric (except dot) characters, e.g., '$9.99' => '9.99'
      const cleaned = price.replace(/[^\d.]/g, "");
      if (!isNaN(Number(cleaned)) && cleaned !== "") return `$${Number(cleaned).toFixed(2)}`;
    }
    return "$0.00";
  };

  function SortableCard({ product, handleAddToCart, handleRemoveWishlist }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product._id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: "grab"
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-cyan-400/40 shadow-xl">
          <CardContent className="flex flex-col items-center p-4">
            <Avatar className="w-20 h-20 mb-2">
              <AvatarImage src={product.image || '/default-product.png'} alt={product.title} />
            </Avatar>
            <div className="font-bold text-white text-center mb-1">{product.title}</div>
            <div className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {priceDisplay(product.price)}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded px-3 py-1 font-bold flex items-center gap-1"
                onClick={() => handleAddToCart(product)}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                className="bg-gray-800 dark:bg-gray-800 light:bg-card hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-muted text-pink-400 border border-pink-400 rounded px-3 py-1 font-bold flex items-center gap-1"
                onClick={() => handleRemoveWishlist(product._id)}
              >
                <FaHeart /> Remove
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRemoveWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
    setWishlist(wishlist.filter(item => item._id !== productId));
  };

  const handleAddToCart = async (product: any) => {
    await addToCart(product._id, 1);
    await removeFromWishlist(product._id);
    setWishlist(wishlist.filter(item => item._id !== product._id));
    router.push("/cart");
  };

  return (
    <div className="max-w-6xl mx-auto pt-16 px-2 sm:px-6 min-h-screen">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-cyan-400 tracking-tight text-center drop-shadow-lg"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        Wishlist
      </motion.h1>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
          Your Wishlist
          {wishlist.length > 0 && (
            <span className="ml-2 bg-pink-500 text-white rounded-full px-2 text-xs">{wishlist.length}</span>
          )}
        </h2>
        {wishlist.length > 1 && (
          <div className="mb-6 text-center text-sm text-cyan-200 font-medium bg-cyan-900/40 rounded-lg px-4 py-2 shadow">
            You can <span className="font-bold text-cyan-300">drag and drop</span> items to reorder your wishlist!
          </div>
        )}
        <AnimatePresence>
          {wishlistLoading ? (
            <motion.div className="bg-gray-900 dark:bg-gray-900 light:bg-card rounded-xl p-4 text-gray-300 dark:text-gray-300 light:text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Loading...
            </motion.div>
          ) : wishlist.length === 0 ? (
            <motion.div className="bg-gray-900 dark:bg-gray-900 light:bg-card rounded-xl p-8 text-center text-gray-400 dark:text-gray-400 light:text-muted-foreground flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-5xl mb-2 text-cyan-400 font-extrabold">Wishlist is empty</div>
              <div>Add products to your wishlist to see them here.</div>
            </motion.div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={wishlist.map(item => item._id)} strategy={verticalListSortingStrategy}>
                <Masonry
                  breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                  className="flex w-auto gap-6"
                  columnClassName="masonry-column flex flex-col gap-6"
                >
                  {wishlist.map(product => (
                    <SortableCard
                      key={product._id}
                      product={product}
                      handleAddToCart={handleAddToCart}
                      handleRemoveWishlist={handleRemoveWishlist}
                    />
                  ))}
                </Masonry>
              </SortableContext>
            </DndContext>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WishlistPage;
