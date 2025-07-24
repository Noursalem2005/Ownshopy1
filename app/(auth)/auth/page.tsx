/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Key, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaFacebook as FacebookIcon, FaGoogle } from "react-icons/fa";
import DynamicForm from "@/components/ui/dynamicform";
import axiosInstance from "@/utils/axiosInstance"; // Import the Axios instance
import { AuthContext } from "@/context/AuthContext";
import env from "@/utils/env";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [Error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useContext(AuthContext);

  useEffect(() => {
    // Get the "error" parameter from the URL
    const error = searchParams.get("error");
    if (error) {
      setError(error); // Update the error state
    } else {
      setError(null); // Clear the error state if no error is present
    }

    // Handle the "signup" parameter if needed
    const isSignupParam = searchParams.get("signup");
    if (isSignupParam !== null) {
      setIsSignup(isSignupParam === "true"); // Update the signup state based on the parameter
    }
  }, [searchParams]); // Re-run the effect whenever searchParams change

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "signup") {
      setIsSignup(true); // Set to Sign Up if type is "signup"
    } else if (type === "login") {
      setIsSignup(false); // Set to Sign In if type is "signin"
    }
  }, [searchParams]);
  const toggleForm = () => {
    setIsSignup(!isSignup); // Toggle between Sign Up and Sign In
    setError(null); // Clear the error state
    setErrorMessage(""); // Clear the error message
    setInputValues({}); // Reset the input values
  };
  const fields = isSignup
    ? [
        {
          name: "name",
          type: "text",
          placeholder: "Full Name",
          required: true,
        },
        { name: "email", type: "email", placeholder: "Email", required: true },
        {
          name: "password",
          type: "password",
          placeholder: "Password",
          required: true,
        },
      ]
    : [
        { name: "email", type: "email", placeholder: "Email", required: true },
        {
          name: "password",
          type: "password",
          placeholder: "Password",
          required: true,
        },
      ];

  const handleFormSubmit = async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    setIsError(false);
    setErrorMessage("");
    try {
      console.log("Form Data:", formData);
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const response = await axiosInstance.post(endpoint, formData);

      // Allow any 2xx status code as success
      if (response.status < 200 || response.status >= 300) {
        setIsError(true);
        setErrorMessage(response.data.message || "Failed to submit form!");
        return;
      }

      const data = response.data;
      console.log("Success:", data);

      // Redirect user to the appropriate page
      if (isSignup) {
        router.push("/verfiy-code"); // Replace with your verification page route
      } else {
        await refreshUser(); // Refresh user context after login
        router.push("/"); // Redirect to dashboard for login
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error.message);
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "An error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsSubmitting(true);
    try {
      window.location.href = env.FACEBOOK_AUTH_URL; // Redirect to your backend Facebook login route
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Error:", err.message);
      setIsError(true);
      setErrorMessage(err.response?.data?.message || "An error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      window.location.href = env.GOOGLE_AUTH_URL; // Redirect to your backend Google login route
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error.message);
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "An error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen text-white ">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row ">
        <AnimatePresence mode="wait">
          {/* Left Side - Form Section */}
          <motion.div
            key={isSignup ? "signup" : "sign in"}
            className="w-full  cursor-pointer lg:w-3/5 p-4 sm:p-8 lg:p-12"
            initial={{ opacity: 0, x: isSignup ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignup ? -50 : 50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div
              onClick={() => router.push("/")}
              className="mb-8 lg:mb-5 cusror-pointer"
            >
              <ChevronLeft className="text-muted-foreground h-6 w -6 sm:h-8 sm:w-8 " />
            </div>
            {/* Form Header and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ease: "easeInOut" }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                {isSignup ? "Sign Up" : "Sign In"}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
                {isSignup
                  ? "Join our e-commerce platform and start shopping!"
                  : "Welcome back! Please sign in to your account."}
              </p>
              <DynamicForm
                fields={fields}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting} // Pass isSubmitting as a prop
                isSignUp={isSignup} // Pass isSignUp as a prop
              />
              {isError && (
                <div className="mt-1 text-red-500 text-sm">{errorMessage}</div>
              )}
            </motion.div>

            {/* Social Media Buttons and Sign Up/Sign In Toggle */}
            <motion.div
              className="sm:mt-3 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, ease: "easeInOut" }}
            >
              <div className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                Or continue with
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  className=" cursor-pointer w-12 h-12 sm:w-auto sm:h-auto p-2"
                  disabled={isSubmitting}
                  onClick={handleFacebookLogin}
                >
                  <FacebookIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline-block sm:ml-2">
                    Facebook
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  className="cursor-pointer border-border w-12 h-12 sm:w-auto sm:h-auto p-2"
                  disabled={isSubmitting}
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline-block sm:ml-2">Google</span>
                </Button>
              </div>
            </motion.div>
            {/* Sign Up/Sign In Toggle Text */}
            <motion.div
              className="sm:mt-6 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, ease: "easeInOut" }}
            >
              <p className="text-base sm:text-lg lg:text-xl text-white">
                {isSignup ? "Already a member?" : "Don't have an account?"}
              </p>
              <Button
                variant="link"
                className="text-lg  underline cursor-pointer sm:text-xl lg:text-2xl text-cyan-400 ml-2"
                disabled={isSubmitting}
                onClick={toggleForm}
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Right Side - Gradient Background and Cards */}
        <motion.div
          className="hidden w-full lg:w-2/5 bg-gradient-to-br from-[#00FFFF] to-black p-6 sm:p-8 lg:p-12 lg:flex flex-col justify-between items-center h-full"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, ease: "easeInOut" }}
        >
          <div className="space-y-8 sm:space-y-12 h-full flex flex-col items-center justify-center">
            {/* First Card */}
            <motion.div
              className="bg-black bg-opacity-50 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ease: "easeInOut" }}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Explicit opacity adjustment
            >
              {isSignup ? (
                <>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    New Arrivals
                  </h3>
                  <p className="text-4xl sm:text-5xl font-bold mb-4">1,234</p>
                  <div className="flex justify-between items-center w-full">
                    <div className="h-3 w-24 sm:w-36 bg-black bg-opacity-50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#00FFFF]"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut",
                          delay: 0.6,
                        }}
                      />
                    </div>
                    <span className="text-lg sm:text-2xl font-bold text-end">
                      70% increase
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3 py-0">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    Customer Reviews
                  </h3>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => {
                      const rating = 4.9;
                      const isFullStar = i < Math.floor(rating);
                      const isHalfStar =
                        i === Math.floor(rating) && rating % 1 !== 0;

                      return (
                        <motion.div
                          key={i}
                          className="relative"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.2, duration: 0.5 }}
                        >
                          <Star
                            className={`h-6 w-6 sm:h-8 sm:w-8 mr-1 ${
                              isFullStar || isHalfStar
                                ? "text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                            fill={isFullStar ? "currentColor" : "none"}
                          />
                          {isHalfStar && (
                            <Star
                              className="absolute top-0 left-0 h-6 w-6 sm:h-8 sm:w-8 mr-1 text-yellow-400"
                              style={{
                                clipPath:
                                  "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                              }}
                              fill="currentColor"
                            />
                          )}
                        </motion.div>
                      );
                    })}
                    <span className="ml-2 text-2xl sm:text-3xl font-bold">
                      4.9
                    </span>
                  </div>
                  <p className="text-base sm:text-xl text-gray-200">
                    Based on 10,000+ reviews
                  </p>
                </div>
              )}
            </motion.div>

            {/* Second Card */}
            <motion.div
              className="bg-black bg-opacity-50 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ease: "easeInOut" }}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Explicit opacity adjustment
            >
              <div className="flex items-center mb-4">
                {isSignup ? (
                  <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 mr-4 text-[#00FFFF]" />
                ) : (
                  <Key className="h-6 w-6 sm:h-8 sm:w-8 mr-4 text-[#00FFFF]" />
                )}
                <h3 className="text-lg sm:text-2xl font-bold">
                  {isSignup ? "Exclusive Deals" : "Secure shopping"}
                </h3>
              </div>
              <p className="text-base sm:text-xl text-gray-200">
                {isSignup
                  ? "Sign up now and get access to exclusive deals and promotions"
                  : "Your data is protected with state-of-the-art encryption technology"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
