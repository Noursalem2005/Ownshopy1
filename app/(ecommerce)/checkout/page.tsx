/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaPaypal, 
  FaApplePay, 
  FaMobile,
  FaLock,
  FaShieldAlt,
  FaTruck
} from "react-icons/fa";
import Image from "next/image";
// Import payment components
import PayPalPayment from "@/components/payments/PayPalPayment";
import ApplePayPayment from "@/components/payments/ApplePayPayment";
import FawryPayment from "@/components/payments/FawryPayment";

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  
  // Get single product checkout params
  const productId = searchParams.get("productId");
  const qty = searchParams.get("qty");
  
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPaymentComponent, setShowPaymentComponent] = useState(false);
  const [tempOrderId, setTempOrderId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    // Shipping Address
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    
    // Order notes
    notes: ""
  });

  // Fetch single product if direct buy
  useEffect(() => {
    if (productId && qty) {
      setLoading(true);
      axiosInstance.get(`/api/products/${productId}`)
        .then(res => {
          setSingleProduct({
            ...res.data,
            quantity: parseInt(qty)
          });
        })
        .catch(() => {
          toast.error("Failed to load product");
          router.push("/");
        })
        .finally(() => setLoading(false));
    }
  }, [productId, qty, router]);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  // Calculate order totals
  const calculateTotals = () => {
    let items = [];
    let subtotal = 0;

    if (singleProduct) {
      // Single product checkout
      const price = parseFloat((singleProduct.price || "0").toString().replace("$", ""));
      items = [singleProduct];
      subtotal = price * singleProduct.quantity;
    } else {
      // Cart checkout
      items = cart.items.filter((item: any) => item.product && item.product._id);
      subtotal = items.reduce((sum: number, item: any) => {
        const price = parseFloat((item.product.price || "0").toString().replace("$", ""));
        return sum + (price * item.quantity);
      }, 0);
    }

    const shipping = subtotal > 0 && subtotal < 100 ? 15 : subtotal >= 100 ? 30 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { items, subtotal, shipping, tax, total };
  };

  const { items, subtotal, shipping, tax, total } = calculateTotals();

  // Payment component handlers
  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      // Update the order with payment result
      if (tempOrderId) {
        await axiosInstance.put(`/api/orders/${tempOrderId}`, {
          paymentResult,
          status: paymentResult?.status === 'succeeded' || paymentResult?.status === 'completed' ? 'Paid' : 'Processing'
        });
      }
      
      // Clear cart if it was a cart checkout
      if (!singleProduct) {
        await clearCart();
      }
      
      toast.success("Payment successful! Order placed.");
      
      // Redirect to orders page instead of showing success on checkout
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } catch (error) {
      console.error("Order update failed:", error);
      toast.error("Payment successful but order update failed. Please contact support.");
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setShowPaymentComponent(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "address", "city", "state", "zipCode"];
    if (paymentMethod === "card") {
      required.push("cardNumber", "cardName", "expiryDate", "cvv");
    }
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error("No items to checkout");
      return;
    }

    setOrderProcessing(true);
    
    try {
      // Create the order first
      const orderData = {
        items: items.map((item: any) => ({
          product: singleProduct ? item._id : item.product._id,
          quantity: item.quantity,
          price: parseFloat((singleProduct ? item.price : item.product.price).toString().replace("$", ""))
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        notes: formData.notes,
        userEmail: formData.email,
        status: 'Processing'
      };

      const order = await axiosInstance.post("/api/orders", orderData);
      setTempOrderId(order.data._id);

      // Save guest email for order tracking if not authenticated
      if (!user && formData.email) {
        localStorage.setItem('guestEmail', formData.email);
        sessionStorage.setItem('guestEmail', formData.email);
      }

      if (paymentMethod === "card") {
        // For demo purposes, simulate card payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const paymentResult = {
          id: `card_${Date.now()}`,
          status: 'succeeded',
          amount: total,
          paymentMethod: 'card'
        };

        await handlePaymentSuccess(paymentResult);

      } else {
        // Show payment component for alternative methods
        setShowPaymentComponent(true);
        toast.info(`Continue with ${paymentMethod} payment below`);
      }
      
    } catch (error: any) {
      console.error("Order creation failed:", error);
      const errorMessage = error.response?.data?.error || error.message || "Order creation failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          className="text-cyan-400 text-xl font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading checkout...
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && !singleProduct) {
    return (
      <motion.div
        className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-xl mb-4">No items to checkout</div>
        <Button onClick={() => router.push("/")} variant="outline">
          Continue Shopping
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-16 px-2 sm:px-4 pb-8">
      <motion.button
        className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-lg"
        onClick={() => router.back()}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <FaArrowLeft /> Back
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.div
          key="checkout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl font-extrabold mb-8 text-[#00ffff] tracking-tight"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            🛒 Checkout
          </motion.h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gray-900 border-cyan-400/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300 flex items-center gap-2">
                        <FaTruck /> Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-cyan-400/50 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-cyan-400/50 text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-gray-300">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-cyan-400/50 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-cyan-400/50 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address" className="text-gray-300">Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-cyan-400/50 text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-gray-300">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-cyan-400/50 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-gray-300">State *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-cyan-400/50 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="text-gray-300">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-cyan-400/50 text-white"
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gray-900 border-cyan-400/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300 flex items-center gap-2">
                        <FaLock /> Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Payment Options */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: "card", icon: FaCreditCard, label: "Card", color: "text-blue-400" },
                          { id: "paypal", icon: FaPaypal, label: "PayPal", color: "text-blue-600" },
                          { id: "apple", icon: FaApplePay, label: "Apple Pay", color: "text-gray-400" },
                          { id: "fawry", icon: FaMobile, label: "Fawry", color: "text-orange-400" }
                        ].map((method) => (
                          <motion.button
                            key={method.id}
                            type="button"
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                              paymentMethod === method.id
                                ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                                : "border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500"
                            }`}
                            onClick={() => setPaymentMethod(method.id)}
                            whileTap={{ scale: 0.95 }}
                          >
                            <method.icon className={`text-xl ${paymentMethod === method.id ? 'text-cyan-300' : method.color}`} />
                            <span className="text-sm font-medium">{method.label}</span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Payment Method Specific Sections */}
                      <AnimatePresence>
                        {/* Card Details */}
                        {paymentMethod === "card" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 pt-4 border-t border-gray-700"
                          >
                            <div className="text-sm text-gray-400 mb-3">
                              💳 Enter your card details below
                            </div>
                            <div>
                              <Label htmlFor="cardNumber" className="text-gray-300">Card Number *</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                className="bg-gray-800 border-cyan-400/50 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardName" className="text-gray-300">Name on Card *</Label>
                              <Input
                                id="cardName"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                className="bg-gray-800 border-cyan-400/50 text-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date *</Label>
                                <Input
                                  id="expiryDate"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={handleInputChange}
                                  placeholder="MM/YY"
                                  className="bg-gray-800 border-cyan-400/50 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv" className="text-gray-300">CVV *</Label>
                                <Input
                                  id="cvv"
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  placeholder="123"
                                  className="bg-gray-800 border-cyan-400/50 text-white"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* PayPal Instructions */}
                        {paymentMethod === "paypal" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-4 border-t border-gray-700"
                          >
                            <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <FaPaypal className="text-blue-400 text-xl" />
                                <h4 className="font-semibold text-blue-300">PayPal Payment</h4>
                              </div>
                              <p className="text-sm text-gray-300">
                                You&apos;ll be redirected to PayPal to complete your payment securely.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Apple Pay Instructions */}
                        {paymentMethod === "apple" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-4 border-t border-gray-700"
                          >
                            <div className="bg-gray-600/20 border border-gray-600/30 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <FaApplePay className="text-gray-300 text-xl" />
                                <h4 className="font-semibold text-gray-300">Apple Pay</h4>
                              </div>
                              <p className="text-sm text-gray-300">
                                Use Touch ID, Face ID, or your device passcode to pay with Apple Pay.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Fawry Instructions */}
                        {paymentMethod === "fawry" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-4 border-t border-gray-700"
                          >
                            <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <FaMobile className="text-orange-400 text-xl" />
                                <h4 className="font-semibold text-orange-300">Fawry Payment</h4>
                              </div>
                              <p className="text-sm text-gray-300 mb-2">
                                Pay using Fawry - Egypt&apos;s leading electronic payment network.
                              </p>
                              <ul className="text-xs text-gray-400 space-y-1">
                                <li>• Visit any Fawry kiosk nationwide</li>
                                <li>• Use Fawry mobile app or website</li>
                                <li>• Pay at participating stores</li>
                                <li>• Reference number will be provided after order</li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Order Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gray-900 border-cyan-400/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300">Order Notes (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for your order..."
                        className="bg-gray-800 border-cyan-400/50 text-white resize-none"
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gray-900 border-cyan-400/30 sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {items.map((item: any) => {
                        const product = singleProduct ? item : item.product;
                        const quantity = item.quantity;
                        const price = parseFloat((product.price || "0").toString().replace("$", ""));
                        
                        return (
                          <div key={product._id} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                            <Image
                              src={product.image || "/default-product.png"}
                              alt={product.title}
                              width={50}
                              height={50}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white line-clamp-2">
                                {product.title}
                              </div>
                              <div className="text-xs text-gray-400">
                                Qty: {quantity} × ${price.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-cyan-300 font-bold">
                              ${(price * quantity).toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator className="bg-gray-700" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator className="bg-gray-700" />
                      <div className="flex justify-between text-lg font-bold text-white">
                        <span>Total</span>
                        <span className="text-cyan-300">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-green-400 text-sm p-2 bg-green-400/10 rounded">
                      <FaShieldAlt />
                      <span>Secure Checkout</span>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={orderProcessing}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3"
                    >
                      {orderProcessing ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Processing Order...
                        </motion.div>
                      ) : (
                        `Place Order - $${total.toFixed(2)}`
                      )}
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      By placing this order, you agree to our Terms of Service and Privacy Policy.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Payment Components Section */}
            <AnimatePresence>
              {showPaymentComponent && tempOrderId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
                >
                  <Card className="bg-gray-900 border-cyan-400/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300 flex items-center gap-2">
                        <FaLock /> Complete Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {paymentMethod === "paypal" && (
                        <PayPalPayment
                          amount={total}
                          orderId={tempOrderId}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      )}
                      {paymentMethod === "apple" && (
                        <ApplePayPayment
                          amount={total}
                          orderId={tempOrderId}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      )}
                      {paymentMethod === "fawry" && (
                        <FawryPayment
                          amount={total}
                          orderId={tempOrderId}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
