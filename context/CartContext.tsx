"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance"; // Adjust the import path as needed
import { useAuth } from "@/context/AuthContext";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any>({ items: [] });
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      // User is logged in, fetch their cart from backend
      axiosInstance.get(`/api/cart/${user._id}`).then(res => setCart(res.data));
    } else {
      // User is not logged in, show empty cart locally (don't clear backend)
      setCart({ items: [] });
    }
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user?._id) return;
    if (!productId) return;
    const res = await axiosInstance.post(`/api/cart/${user._id}`, { productId, quantity });
    setCart(res.data);
  };

  const removeFromCart = async (productId: string) => {
    if (!user?._id) return;
    const res = await axiosInstance.delete(`/api/cart/${user._id}/${productId}`);
    setCart(res.data);
  };

  // Add this function:
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?._id) return;
    if (!productId) return;
    // Use the same endpoint as addToCart, but with the new quantity
    const res = await axiosInstance.post(`/api/cart/${user._id}`, { productId, quantity });
    setCart(res.data);
  };

  // Add this function:
  const clearCart = async () => {
    if (user?._id) {
      try {
        console.log("Clearing cart for user:", user._id);
        // Clear cart on backend using the correct endpoint
        await axiosInstance.delete(`/api/cart/${user._id}/clear`);
        console.log("Cart cleared on backend");
      } catch (error) {
        console.error("Failed to clear cart on backend:", error);
      }
    }
    // Clear cart in local state
    setCart({ items: [] });
    console.log("Cart cleared locally");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);