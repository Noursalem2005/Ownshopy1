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

// Attach Authorization header from localStorage if present (useful when
// the app stores JWT in localStorage instead of cookies). verifyToken
// middleware accepts cookie (req.cookies.token), x-auth-token or
// Authorization: Bearer <token> so this supports both flows.
axiosInstance.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        // Don't override if already set by other code
        if (!config.headers.Authorization && !config.headers.authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
  } catch {
    // ignore - localStorage may be unavailable in some environments
  }
  return config;
}, (error) => Promise.reject(error));


export default axiosInstance;