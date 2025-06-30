/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaypal, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

interface PayPalPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ 
  amount, 
  orderId, 
  onSuccess, 
  onError 
}) => {
  const [processing, setProcessing] = useState(false);

  const handlePayPalPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate PayPal redirect and processing
      toast.info("Redirecting to PayPal...");
      
      const response = await axiosInstance.post("/api/payments/process-payment", {
        paymentMethod: 'paypal',
        amount,
        orderId
      });

      if (response.data.success) {
        toast.success("PayPal payment successful!");
        onSuccess(response.data.paymentResult);
      } else {
        throw new Error("PayPal payment failed");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "PayPal payment failed";
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
      <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-6">
        <div className="text-center">
          <FaPaypal className="text-blue-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-300 mb-2">
            Pay with PayPal
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            You&apos;ll be securely redirected to PayPal to complete your payment.
          </p>
          <div className="text-xl font-bold text-blue-300 mb-4">
            ${amount.toFixed(2)}
          </div>
          <Button
            onClick={handlePayPalPayment}
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaPaypal />
                Continue with PayPal
              </div>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PayPalPayment;
