/**
 * Environment configuration utility
 * Provides typed access to environment variables with fallbacks
 */

export const env = {
  // API Configuration
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000",
  
  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "OwnShopy",
  APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Premium E-commerce Platform",
  
  // Stripe Configuration
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  
  // Social Auth URLs
  get FACEBOOK_AUTH_URL() {
    return `${this.BASE_URL}/auth/facebook`;
  },
  
  get GOOGLE_AUTH_URL() {
    return `${this.BASE_URL}/auth/google`;
  },
  
  // API Endpoints
  get API_CONTACT() {
    return `${this.BASE_URL}/api/contact`;
  },
  
  // Helper to build full asset URLs
  buildAssetUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${this.BASE_URL}/${path.replace(/^\/+/, "")}`;
  },
  
  // Development mode check
  get isDevelopment() {
    return process.env.NODE_ENV === "development";
  },
  
  get isProduction() {
    return process.env.NODE_ENV === "production";
  }
} as const;

export default env;
