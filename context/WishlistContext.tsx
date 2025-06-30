/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

interface WishlistContextType {
  wishlist: Set<string>;
  isWished: (id: string) => boolean;
  addToWishlist: (id: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Fetch wishlist on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshWishlist();
    } else {
      setWishlist(new Set());
    }
  }, [user]);

  const refreshWishlist = async () => {
    try {
      const res = await axiosInstance.get("/api/profile/wishlist");
      const ids = (res.data?.wishlist || []).map((item: any) => item._id || item.productId || item);
      setWishlist(new Set(ids));
    } catch {
      setWishlist(new Set());
    }
  };

  const isWished = (id: string) => wishlist.has(id);

  const addToWishlist = async (id: string) => {
    await axiosInstance.post("/api/profile/wishlist", { productId: id });
    setWishlist((prev) => new Set(prev).add(id));
  };

  const removeFromWishlist = async (id: string) => {
    await axiosInstance.delete(`/api/profile/wishlist/${id}`);
    setWishlist((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const clearWishlist = () => setWishlist(new Set());

  return (
    <WishlistContext.Provider value={{ wishlist, isWished, addToWishlist, removeFromWishlist, refreshWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
