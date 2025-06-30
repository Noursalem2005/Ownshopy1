/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMobile, FaSpinner, FaStore, FaQrcode, FaCopy } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

interface FawryPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
}

const FawryPayment: React.FC<FawryPaymentProps> = ({ 
  amount, 
  orderId, 
  onSuccess, 
  onError 
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handleFawryPayment = async () => {
    setProcessing(true);
    
    try {
      toast.info("Generating Fawry payment code...");
      
      const response = await axiosInstance.post("/api/payments/process-payment", {
        paymentMethod: 'fawry',
        amount,
        orderId
      });

      if (response.data.success) {
        setPaymentResult(response.data.paymentResult);
        toast.success("Fawry payment code generated!");
        // Don't call onSuccess immediately - wait for actual payment confirmation
      } else {
        throw new Error("Fawry payment code generation failed");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Fawry payment failed";
      toast.error(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const copyReferenceNumber = () => {
    if (paymentResult?.referenceNumber) {
      navigator.clipboard.writeText(paymentResult.referenceNumber);
      toast.success("Reference number copied to clipboard!");
    }
  };

  const confirmPayment = () => {
    // In a real implementation, you'd verify payment with Fawry API
    toast.success("Payment confirmed! Thank you for using Fawry.");
    onSuccess(paymentResult);
  };

  if (paymentResult) {
    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-6">
          <div className="text-center mb-6">
            <FaMobile className="text-orange-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-orange-300 mb-2">
              Fawry Payment Generated
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Use the reference number below to complete your payment
            </p>
          </div>

          {/* Reference Number */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Reference Number</p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl font-mono font-bold text-orange-300">
                  {paymentResult.referenceNumber}
                </span>
                <Button
                  onClick={copyReferenceNumber}
                  variant="outline"
                  size="sm"
                  className="p-2 border-orange-400 text-orange-400 hover:bg-orange-400/20"
                >
                  <FaCopy />
                </Button>
              </div>
              <p className="text-lg font-semibold text-white">
                Amount: ${amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-orange-300 mb-3">How to Pay:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <FaStore className="text-orange-400 text-2xl mx-auto mb-2" />
                <h5 className="font-semibold text-white mb-1">Fawry Kiosks</h5>
                <p className="text-xs text-gray-400">
                  Visit any Fawry kiosk nationwide and provide the reference number
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <FaMobile className="text-orange-400 text-2xl mx-auto mb-2" />
                <h5 className="font-semibold text-white mb-1">Fawry App</h5>
                <p className="text-xs text-gray-400">
                  Use the Fawry mobile app or website to pay online
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <FaQrcode className="text-orange-400 text-2xl mx-auto mb-2" />
                <h5 className="font-semibold text-white mb-1">Partner Stores</h5>
                <p className="text-xs text-gray-400">
                  Pay at participating stores across Egypt
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <h5 className="font-semibold text-yellow-300 mb-2">Important:</h5>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Payment must be completed within 24 hours</li>
              <li>• Keep your reference number safe</li>
              <li>• Payment confirmation may take a few minutes</li>
              <li>• Contact support if you face any issues</li>
            </ul>
          </div>

          {/* Demo Confirmation Button */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">
              For demo purposes, click below to simulate payment completion:
            </p>
            <Button
              onClick={confirmPayment}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6"
            >
              Simulate Payment Completion
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-6">
        <div className="text-center">
          <FaMobile className="text-orange-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-300 mb-2">
            Pay with Fawry
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Egypt&apos;s leading electronic payment network. Pay at kiosks, stores, or online.
          </p>
          <div className="text-xl font-bold text-orange-300 mb-4">
            ${amount.toFixed(2)}
          </div>
          <Button
            onClick={handleFawryPayment}
            disabled={processing}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Generating Payment Code...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaMobile />
                Generate Fawry Payment Code
              </div>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FawryPayment;
