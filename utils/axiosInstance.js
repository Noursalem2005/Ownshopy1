import axios from "axios";

// Prefer a local backend when running the frontend in the browser on localhost.
let baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
// In browser dev, prefer the local backend when running on localhost/127.0.0.1
if (typeof window !== 'undefined' && window.location && window.location.hostname) {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost')) {
    baseURL = 'http://localhost:8000';
  }
}

const axiosInstance = axios.create({
  baseURL, // API base URL
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
        // Build a best-effort request URL string that works for absolute and relative requests
        const cfg = error.config || {};
        const cfgUrl = cfg.url || "";
        const cfgBase = cfg.baseURL || "";
        const requestResponseUrl = error.request?.responseURL || error.response?.request?.responseURL || "";
        const fullRequestUrl = (() => {
          // If cfgUrl is absolute, use it. Otherwise, join base + url when available.
          try {
            if (cfgUrl.startsWith('http')) return cfgUrl;
          } catch {
            // ignore malformed cfgUrl
          }
          if (cfgBase && cfgUrl) {
            return cfgBase.endsWith('/') || cfgUrl.startsWith('/') ? `${cfgBase}${cfgUrl}` : `${cfgBase}/${cfgUrl}`;
          }
          return cfgUrl || requestResponseUrl || '';
        })();

        const isAuthCheck = fullRequestUrl.includes('/api/auth/check-auth') || cfgUrl.includes('/api/auth/check-auth');
        const isWishlistEndpoint = fullRequestUrl.includes('/api/profile/wishlist') || cfgUrl.includes('/api/profile/wishlist');

        if (isAuthCheck) {
          // Gracefully handle auth-check 401s: return a resolved response-like object
          // so callers (AuthContext) can treat it as 'no user' without an exception.
          return Promise.resolve({ data: { success: false, user: null }, status: 401, headers: {} });
        }

        // For other 401s, log only when it's not a wishlist endpoint (wishlist may return 401 for guests)
        if (!isWishlistEndpoint) {
          console.error("Unauthorized! Redirecting to login...");
        }
        // Wishlist 401s and other 401s will continue to reject below
      }
    return Promise.reject(error);
  }
);

export default axiosInstance;