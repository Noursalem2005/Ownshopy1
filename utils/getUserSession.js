import axiosInstance from "./axiosInstance";

export const getUserSession = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/check-auth");
    return response.data; // Should contain user info if authenticated
  } catch {
    return null; // Not authenticated or error occurred
  }
};