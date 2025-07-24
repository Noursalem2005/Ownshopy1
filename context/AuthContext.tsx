/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext<{ user: any, loading: boolean, refreshUser: () => Promise<void> }>({ user: null, loading: true, refreshUser: async () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper to refresh user session
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/auth/check-auth", { withCredentials: true });
      setUser(res.data.user);
    } catch (error: any) {
      // Silently handle 401 errors for guest users - this is expected
      if (error.response?.status !== 401) {
        console.error('Auth check failed:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Always check auth on mount - we can't read HttpOnly cookies with JS
    refreshUser();
  }, [refreshUser]);

  // Expose refreshUser in context for login/logout pages
  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);