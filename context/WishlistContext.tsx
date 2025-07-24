/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      // If no user, set empty wishlist without making API call
      setWishlist(new Set());
      return;
    }
    
    try {
      const res = await axiosInstance.get("/api/profile/wishlist");
      const ids = (res.data?.wishlist || []).map((item: any) => item._id || item.productId || item);
      setWishlist(new Set(ids));
    } catch {
      setWishlist(new Set());
    }
  }, [user]);

  // Fetch wishlist on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshWishlist();
    } else {
      setWishlist(new Set());
    }
  }, [user, refreshWishlist]);

  const isWished = (id: string) => wishlist.has(id);

  const addToWishlist = async (id: string) => {
    if (!user) {
      // For guest users, don't make API call or show error
      return;
    }
    
    try {
      await axiosInstance.post("/api/profile/wishlist", { productId: id });
      setWishlist((prev) => new Set(prev).add(id));
    } catch (error) {
      // Silently handle errors for wishlist operations
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!user) {
      // For guest users, don't make API call or show error
      return;
    }
    
    try {
      await axiosInstance.delete(`/api/profile/wishlist/${id}`);
      setWishlist((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      // Silently handle errors for wishlist operations
      console.error('Failed to remove from wishlist:', error);
    }
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
