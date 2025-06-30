/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FaBox, 
  FaTruck, 
  FaCheck, 
  FaClock, 
  FaTimes, 
  FaEye,
  FaArrowLeft,
  FaShippingFast,
  FaHome
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    try {
      let response;
      if (user) {
        // Authenticated user - also pass email to catch guest orders
        console.log("Fetching orders for authenticated user:", user.email);
        const params = new URLSearchParams();
        if (user.email) params.append('email', user.email);
        const queryString = params.toString();
        response = await axiosInstance.get(`/api/orders${queryString ? `?${queryString}` : ''}`);
      } else {
        // Guest user - try to get email from localStorage or session
        const guestEmail = localStorage.getItem('guestEmail') || sessionStorage.getItem('guestEmail');
        console.log("Fetching guest orders for email:", guestEmail);
        if (guestEmail) {
          response = await axiosInstance.get(`/api/orders?email=${encodeURIComponent(guestEmail)}`);
        } else {
          console.log("No guest email found, showing empty orders");
          setOrders([]);
          setLoading(false);
          return;
        }
      }
      console.log("Orders response:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch user orders
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return <FaClock className="text-yellow-400" />;
      case 'paid':
        return <FaCheck className="text-blue-400" />;
      case 'shipped':
        return <FaTruck className="text-purple-400" />;
      case 'delivered':
        return <FaHome className="text-green-400" />;
      case 'cancelled':
        return <FaTimes className="text-red-400" />;
      default:
        return <FaBox className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'paid':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      case 'shipped':
        return 'bg-purple-400/20 text-purple-400 border-purple-400/30';
      case 'delivered':
        return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'cancelled':
        return 'bg-red-400/20 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'processing', label: 'Order Placed', icon: FaClock },
      { key: 'paid', label: 'Payment Confirmed', icon: FaCheck },
      { key: 'shipped', label: 'Shipped', icon: FaTruck },
      { key: 'delivered', label: 'Delivered', icon: FaHome }
    ];

    const statusOrder = ['processing', 'paid', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status?.toLowerCase());

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          className="text-cyan-400 text-xl font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading orders...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-xl mb-4">Please sign in to view your orders</div>
        <Button onClick={() => router.push("/auth?type=login")} className="bg-cyan-500 hover:bg-cyan-600">
          Sign In
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-16 px-2 sm:px-4 pb-8">
      <motion.button
        className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-lg"
        onClick={() => router.back()}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <FaArrowLeft /> Back
      </motion.button>

      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl sm:text-3xl font-extrabold text-[#00ffff] tracking-tight"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          📦 My Orders
        </motion.h1>
        
        <Button
          onClick={fetchOrders}
          variant="outline"
          className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {selectedOrder ? (
          // Order Details View
          <motion.div
            key="order-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
              >
                <FaArrowLeft className="mr-2" /> Back to Orders
              </Button>
              <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                {getStatusIcon(selectedOrder.status)}
                <span className="ml-2">{selectedOrder.status}</span>
              </div>
            </div>

            {/* Order Info */}
            <Card className="bg-gray-900 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <FaBox /> Order #{selectedOrder._id?.slice(-8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-white mb-2">Order Date</h3>
                    <p className="text-gray-300">{formatDate(selectedOrder.placedAt || selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Total Amount</h3>
                    <p className="text-cyan-300 font-bold text-lg">${selectedOrder.total?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="mt-6">
                  <h3 className="font-bold text-white mb-4">Order Progress</h3>
                  <div className="flex items-center justify-between">
                    {getTrackingSteps(selectedOrder.status).map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          step.completed 
                            ? 'bg-cyan-400 border-cyan-400 text-black' 
                            : step.active 
                              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/20'
                              : 'border-gray-600 text-gray-400'
                        }`}>
                          <step.icon />
                        </div>
                        <div className={`text-xs mt-2 text-center ${
                          step.completed || step.active ? 'text-cyan-300' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </div>
                        {index < getTrackingSteps(selectedOrder.status).length - 1 && (
                          <div className={`absolute h-0.5 w-full top-5 left-1/2 -z-10 ${
                            step.completed ? 'bg-cyan-400' : 'bg-gray-600'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-gray-900 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <FaShippingFast /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300">
                  <p className="font-semibold text-white">
                    {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                  </p>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-gray-900 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, index: number) => {
                    const product = item.product;
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                        <Image
                          src={product?.image || "/default-product.png"}
                          alt={product?.title || "Product"}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{product?.title}</h4>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                          <p className="text-cyan-300 font-bold">${item.price?.toFixed(2)} each</p>
                        </div>
                        <div className="text-cyan-300 font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-gray-700 my-4" />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shipping?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax?.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total:</span>
                    <span className="text-cyan-300">${selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Orders List View
          <motion.div
            key="orders-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {orders.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaBox className="text-6xl text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-400 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-2">When you place orders, they&apos;ll appear here.</p>
                {!user && (
                  <p className="text-xs text-gray-600 mb-4">
                    Guest email: {localStorage.getItem('guestEmail') || 'Not set'}
                  </p>
                )}
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => router.push("/")} className="bg-cyan-500 hover:bg-cyan-600">
                    Start Shopping
                  </Button>
                  <Button onClick={fetchOrders} variant="outline" className="border-cyan-400 text-cyan-400">
                    Refresh Orders
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900 border-cyan-400/30 hover:border-cyan-400/50 transition-colors cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-white">
                                Order #{order._id?.slice(-8)}
                              </h3>
                              <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{order.status}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              Placed on {formatDate(order.placedAt || order.createdAt)}
                            </p>
                            <p className="text-cyan-300 font-bold">
                              ${order.total?.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => setSelectedOrder(order)}
                              variant="outline"
                              size="sm"
                              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                            >
                              <FaEye className="mr-1" /> View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
