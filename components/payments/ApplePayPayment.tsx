/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaApplePay, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

// Extend Window interface to include ApplePaySession
declare global {
  interface Window {
    ApplePaySession?: any;
  }
  // eslint-disable-next-line no-var
  var ApplePaySession: any;
}

interface ApplePayPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
}

const ApplePayPayment: React.FC<ApplePayPaymentProps> = ({ 
  amount, 
  orderId, 
  onSuccess, 
  onError 
}) => {
  const [processing, setProcessing] = useState(false);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);

  useEffect(() => {
    // Check if Apple Pay is available
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      setIsApplePayAvailable(true);
    }
  }, []);

  const handleApplePayPayment = async () => {
    if (!isApplePayAvailable) {
      toast.error("Apple Pay is not available on this device");
      return;
    }

    setProcessing(true);
    
    try {
      // For demo purposes, simulate Apple Pay processing
      toast.info("Processing Apple Pay payment...");
      
      const response = await axiosInstance.post("/api/payments/process-payment", {
        paymentMethod: 'apple',
        amount,
        orderId
      });

      if (response.data.success) {
        toast.success("Apple Pay payment successful!");
        onSuccess(response.data.paymentResult);
      } else {
        throw new Error("Apple Pay payment failed");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Apple Pay payment failed";
      toast.error(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-6">
        <div className="text-center">
          <FaApplePay className="text-gray-300 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Pay with Apple Pay
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Use Touch ID, Face ID, or your device passcode to pay securely.
          </p>
          <div className="text-xl font-bold text-gray-300 mb-4">
            ${amount.toFixed(2)}
          </div>
          <Button
            onClick={handleApplePayPayment}
            disabled={processing || !isApplePayAvailable}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaApplePay />
                {isApplePayAvailable ? "Pay with Apple Pay" : "Apple Pay Unavailable"}
              </div>
            )}
          </Button>
          {!isApplePayAvailable && (
            <p className="text-xs text-gray-500 mt-2">
              Apple Pay is only available on supported Apple devices
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ApplePayPayment;
