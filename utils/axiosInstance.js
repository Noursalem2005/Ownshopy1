import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000", // Replace with your API base URL
  timeout: 10000, // Optional: Set a timeout for requests  
  withCredentials: true, // Include cookies in requests
});

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
      }
      // Don't log anything for auth check or wishlist 401s - they're expected for guest users
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;