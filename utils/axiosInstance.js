import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000", // Replace with your API base URL
  timeout: 10000, // Optional: Set a timeout for requests  
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage as fallback
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Check if this is an auth check or wishlist endpoint
      const isAuthCheck = error.config?.url?.includes('/api/auth/check-auth');
      const isWishlistEndpoint = error.config?.url?.includes('/api/profile/wishlist');
      if (!isAuthCheck && !isWishlistEndpoint) {
        console.error("Unauthorized! Redirecting to login...");
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
      }
      // Don't log anything for auth check or wishlist 401s - they're expected for guest users
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;