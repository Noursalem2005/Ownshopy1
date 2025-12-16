/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Extract token and handle navigation
import { toast } from "sonner"; // Import the toast function
import axiosInstance from "../../../../utils/axiosInstance"; // Adjust the path to your axios instance
import { Button } from "../../../../components/ui/button"; // Adjust the path to your Button component

const ResetPasswordWithToken: React.FC = () => {
  const { token } = useParams(); // Extract the token from the URL
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  // Function to check password strength
  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return "Strong";
    return "Medium";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
  // Do not log tokens or other sensitive values
  
      // Send the token as a URL parameter and the password in the request body
      const response = await axiosInstance.post(`/api/auth/reset-password/${token}`, {
        password, // Include the password in the request body
      });
  
      if (response.data.success) {
        toast.success("Your password has been reset successfully.");
        router.push("/auth/login"); // Redirect to login page after success
      } else {
        toast.error(response.data.message || "Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        toast.error("No response from the server. Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your new password below. Make sure it is strong and secure.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your new password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 text-sm">
              <span
                className={`font-semibold ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {passwordStrength ? `Password Strength: ${passwordStrength}` : ""}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
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
              <span>Reset Password</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordWithToken;