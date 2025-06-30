/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button"; // Adjust the path to your Button component
import { toast } from "sonner"; // Import the toast function
import axiosInstance from "../../../utils/axiosInstance"; // Adjust the path to your axios instance
import { useRouter } from "next/navigation"; // Use the correct useRouter import

const Forgot_password: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter(); // Correct useRouter from next/navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", { email });
      if (response.data.success) {
        toast.success("A password reset link has been sent to your email.");
        router.push("/auth"); // Redirect to login page after success
      } else {
        toast.error(response.data.message || "Failed to send password reset link. Please try again.");
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        toast.error(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        // Request was made but no response was received
        toast.error("No response from the server. Please check your internet connection.");
      } else {
        // Something else happened while setting up the request
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-zinc-200 shadow-[#00FFFF] p-6 rounded-lg  shadow-xl s w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium">
              Enter your email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
            />
          </div>
          <Button
            type="submit"
            className={`px-4 py-2 rounded-md cursor-pointer transition-colors duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-opacity-50
            focus:ring-offset-2 focus:ring-offset-gray-800
            ${
              isSubmitting
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Submitting...</span>
              </div>
            ) : (
              <span>Send Reset Link</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Forgot_password;