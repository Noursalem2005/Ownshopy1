/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

interface WishlistContextType {
  wishlist: Set<string>;
  wishlistItems: any[];
  isWished: (id: string) => boolean;
  addToWishlist: (id: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  // Return the latest items so callers can use them immediately
  refreshWishlist: () => Promise<any[]>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const { user } = useAuth();

  const refreshWishlist = useCallback(async () => {
    // Prevent concurrent refreshes which can cause tight loops if callers repeatedly call refresh
    // Use a ref-based mutex so callers get the cached items while a request is in flight.
    const isRefreshingRef = (refreshWishlist as any)._isRefreshingRef as { current?: boolean } | undefined;
    // Ensure the ref exists and is stored on the function so it survives re-creations
    if (!isRefreshingRef) {
      (refreshWishlist as any)._isRefreshingRef = { current: false };
    }
    const ref = (refreshWishlist as any)._isRefreshingRef;
    if (ref.current) {
      // Return currently cached items while a refresh is in progress to avoid flooding the server
      return wishlistItems;
    }
    ref.current = true;
    if (!user) {
      // If no user, set empty wishlist without making API call
      setWishlist(new Set());
      setWishlistItems([]);
      ref.current = false;
      return [];
    }
    
    try {
      const res = await axiosInstance.get("/api/profile/wishlist");
      const items = res.data?.wishlist || [];
      const ids = items.map((item: any) => item._id || item.productId || item);
      setWishlist(new Set(ids));
      setWishlistItems(items);
      ref.current = false;
      return items;
    } catch {
      setWishlist(new Set());
      setWishlistItems([]);
      ref.current = false;
      return [];
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
      const res = await axiosInstance.post("/api/profile/wishlist", { productId: id });
      const items = res.data?.wishlist || [];
      const ids = items.map((item: any) => item._id || item.productId || item);
      setWishlist(new Set(ids));
      setWishlistItems(items);
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
      const res = await axiosInstance.delete(`/api/profile/wishlist/${id}`);
      const items = res.data?.wishlist || [];
      const ids = items.map((item: any) => item._id || item.productId || item);
      setWishlist(new Set(ids));
      setWishlistItems(items);
    } catch (error) {
      // Silently handle errors for wishlist operations
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const clearWishlist = () => setWishlist(new Set());

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistItems, isWished, addToWishlist, removeFromWishlist, refreshWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
