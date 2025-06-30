/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  // Defensive subtotal calculation
  const subtotal = cart.items.reduce((sum: number, item: any) => {
    const priceStr = (item?.product?.price ?? "0").replace("$", "");
    const price = parseFloat(priceStr);
    const qty = parseInt(item?.quantity ?? "1", 10);
    return (
      sum + (!isNaN(price) && price > 0 ? price * (isNaN(qty) ? 1 : qty) : 0)
    );
  }, 0);

  // Shipping logic
  const shipping =
    subtotal > 0 && subtotal < 100 ? 15 : subtotal >= 100 ? 30 : 0;
  const grandTotal = subtotal + shipping;

  // Handler for increment/decrement
  const handleQuantityChange = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity(productId, newQty);
  };

  if (!cart.items.length) {
    return (
      <motion.div
        className="min-h-[60vh] flex items-center justify-center text-gray-400 text-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4 }}
      >
        Your cart is empty.
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-16 px-2 sm:px-4">
      <motion.h1
        className="text-2xl sm:text-3xl font-extrabold mb-8 text-[#00ffff] tracking-tight"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        🛒 Your Cart
      </motion.h1>
      <motion.div
        className="flex flex-col lg:flex-row items-start gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4 }}
      >
        {/* Cart Items */}
        <div className="w-full flex-1">
          <ul className="space-y-4">
            <AnimatePresence>
              {cart.items
                .filter((item: any) => item.product && item.product._id)
                .map((item: any) => (
                  <motion.li
                    key={item.product._id}
                    className="relative flex flex-col sm:flex-row items-center justify-between bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-[#00ffff30] hover:shadow-2xl transition"
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <motion.img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-[#00ffff40] shadow shrink-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-base sm:text-lg mb-1 line-clamp-2">
                          {item.product.title}
                        </div>
                        <div className="text-[#00ffff] font-bold text-sm sm:text-base">
                          $
                          {!isNaN(
                            parseFloat(
                              (item.product.price ?? "0").replace("$", "")
                            )
                          )
                            ? parseFloat(
                                (item.product.price ?? "0").replace("$", "")
                              ).toFixed(2)
                            : "0.00"}
                        </div>
                        <div className="flex flex-row items-center gap-2 sm:gap-4 mt-2">
                          {/* Quantity Counter */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="w-7 h-7 cursor-pointer sm:w-8 sm:h-8 bg-black border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff20] hover:text-[#111] transition-colors"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  Number(item.quantity) - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              -
                            </Button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product._id,
                                  Number(e.target.value)
                                )
                              }
                              className="w-10 sm:w-12 text-center bg-black border border-[#00ffff] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] transition"
                              aria-label="Quantity"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8 bg-black border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff20] hover:text-[#111] transition-colors"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  Number(item.quantity) + 1
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </Button>
                          </div>
                          {/* Remove Button */}
                          <motion.button
                            className="text-red-500 cursor-pointer font-bold hover:underline hover:text-red-400 px-2 py-1 rounded transition"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.product._id)}
                            aria-label="Remove item"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        </div>
        {/* Sidebar */}
        <motion.div
          className="w-full lg:w-80 bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-[#00ffff30] h-fit self-start mt-8 lg:mt-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-[#00ffff] mb-2">
            Order Summary
          </h2>
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-700 my-2"></div>
          <div className="flex justify-between text-lg font-bold text-white">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button asChild variant="secondary" className="w-full">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button
              className="cursor-pointer w-full font-bold transition-colors bg-[#00ffff] text-[#222] hover:bg-[#00cccc] hover:text-[#111]"
              onClick={() => router.push("/checkout")}
            >
              Confirm Order
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            * Shipping is $15 for orders under $100, $30 for $100 or more.
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Cart;
