/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import { toast } from "sonner"; // Import the toast function
import axiosInstance from "../../../utils/axiosInstance"; // Adjust the path to your axios instance
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/ui/button"; // Adjust the path to your Button component

const VerifyCode: React.FC = () => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the verification code is 6 digits
    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      toast.error("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the verification code to the backend
      const response = await axiosInstance.post("/api/auth/verify-email", {
        code: verificationCode, // Include the verification code in the request body
      });

      if (response.data.success) {
        toast.success("Verification successful! Redirecting to Home...");
        try {
          // Refresh the auth context so the UI picks up the newly-signed-in user
          // call and await refresh so nav/buttons update before navigating
          await refreshUser();
        } catch (err) {
          // if refresh fails, continue to redirect — user can refresh manually as fallback
          // don't spam console in prod; keep minimal logging for debugging
          // console.debug('refreshUser failed after verification', err);
        }

        router.push("/"); // Redirect to home after success
      } else {
        toast.error(response.data.message || "Invalid verification code. Please try again.");
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
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Your Code</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit verification code sent to your email to complete the process.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
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
              <span>Verify Code</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;