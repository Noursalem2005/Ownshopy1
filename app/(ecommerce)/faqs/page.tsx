"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaBoxOpen, FaCreditCard, FaUser, FaUndo, FaQuestionCircle, FaShippingFast, FaRegStar } from "react-icons/fa";

const FAQ_CATEGORIES = [
  { key: "all", label: "All", icon: <FaQuestionCircle /> },
  { key: "orders", label: "Orders", icon: <FaBoxOpen /> },
  { key: "shipping", label: "Shipping", icon: <FaShippingFast /> },
  { key: "returns", label: "Returns", icon: <FaUndo /> },
  { key: "payments", label: "Payments", icon: <FaCreditCard /> },
  { key: "account", label: "Account", icon: <FaUser /> },
];

const FAQS = [
  {
    question: "How do I track my order?",
    answer: "You can track your order from your account dashboard under 'Orders'. You'll also receive email updates.",
    category: "orders",
    popular: true,
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, PayPal, and more. All payments are secured with SSL encryption.",
    category: "payments",
    popular: true,
  },
  {
    question: "How do I reset my password?",
    answer: "Go to your account settings and click 'Reset Password'. Follow the instructions sent to your email.",
    category: "account",
    popular: false,
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping usually takes 3-7 business days depending on your location.",
    category: "shipping",
    popular: true,
  },
  {
    question: "What is your return policy?",
    answer: "You can return most items within 30 days of delivery. See our Returns page for details.",
    category: "returns",
    popular: true,
  },
  {
    question: "Can I change my shipping address?",
    answer: "Yes, you can change your shipping address before your order is shipped from your account dashboard.",
    category: "shipping",
    popular: false,
  },
  // ...add more FAQs as needed
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtered and sorted FAQs
  const filteredFaqs = FAQS.filter(faq =>
    (category === "all" || faq.category === category) &&
    (faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

  // Highlight search matches
  function highlight(text: string) {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-[#00ffff40] text-[#00ffff]">{part}</span> : part
    );
  }

  // Scroll to expanded answer
  useEffect(() => {
    if (openIndex !== null && containerRef.current) {
      const el = document.getElementById(`faq-item-${openIndex}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [openIndex]);

  // Show back to top button
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#0fffc0]/10 via-[#00ffff0a] to-gray-950 text-gray-100 flex flex-col pt-20 md:pt-24 px-2">
      {/* Gradient Header */}
      <div className="w-full max-w-3xl mx-auto text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaQuestionCircle className="text-4xl text-[#00ffff] animate-pulse drop-shadow-glow" />
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#00ffff] to-[#00cccc] bg-clip-text text-transparent inline-block">Frequently Asked Questions</h1>
        </div>
        <p className="text-gray-400 text-lg">Find quick answers to common questions about shopping with OwnShopy.</p>
      </div>
      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-6 flex gap-2" id="faq-search-bar">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-full focus:ring-2 focus:ring-[#00ffff] w-full"
        />
      </div>
      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {FAQ_CATEGORIES.map(cat => (
          <Button
            key={cat.key}
            variant={category === cat.key ? "default" : "outline"}
            className={`rounded-full px-4 flex items-center gap-2 ${category === cat.key ? "bg-[#00ffff] text-gray-900 font-bold border-[#00ffff]" : "bg-gray-800 text-[#00ffff] border-[#00ffff]"}`}
            onClick={() => setCategory(cat.key)}
            aria-pressed={category === cat.key}
          >
            <span className="text-lg">{cat.icon}</span>
            {cat.label}
          </Button>
        ))}
      </div>
      {/* FAQ Accordion */}
      <div ref={containerRef} className="w-full max-w-3xl mx-auto space-y-4 relative">
        <AnimatePresence initial={false}>
          {filteredFaqs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 py-12">
              No FAQs found for your search.
            </motion.div>
          ) : (
            filteredFaqs.map((faq, i) => (
              <motion.div
                key={faq.question}
                id={`faq-item-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`rounded-xl border border-gray-800 bg-gray-900/80 shadow-lg transition-all ${openIndex === i ? "border-[#00ffff] ring-2 ring-[#00ffff80]" : ""}`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#00ffff] rounded-xl group"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#00ffff] text-xl">
                      {FAQ_CATEGORIES.find(c => c.key === faq.category)?.icon || <FaRegStar />}
                    </span>
                    {highlight(faq.question)}
                  </span>
                  <motion.span
                    initial={false}
                    animate={{ rotate: openIndex === i ? 90 : 0 }}
                    className="ml-2 text-[#00ffff] text-2xl"
                  >
                    ▶
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden px-6 pb-4 text-base text-gray-300"
                    >
                      {highlight(faq.answer)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      {/* Didn't find answer CTA */}
      <div className="w-full max-w-2xl mx-auto mt-12 text-center">
        <div className="inline-block bg-gradient-to-r from-[#00ffff] to-[#00cccc] rounded-full px-6 py-3 shadow-lg">
          <span className="text-gray-900 font-bold text-lg mr-3">Didn’t find your answer?</span>
          <Button className="bg-gray-900 text-[#00ffff] border border-[#00ffff] hover:bg-[#00ffff] hover:text-gray-900 font-bold rounded-full px-6" onClick={() => window.location.href = '/contact-us'}>
            Contact Support
          </Button>
        </div>
      </div>
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 z-50 bg-[#00ffff] text-gray-900 font-bold rounded-full shadow-lg px-4 py-2 hover:bg-[#00cccc] border-2 border-[#00ffff]"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            ↑ Top
          </motion.button>
        )}
      </AnimatePresence>
      {/* Animated mascot in corner */}
      <motion.div
        className="fixed bottom-8 left-8 z-40 flex flex-col items-center cursor-pointer group hidden sm:flex"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        tabIndex={0}
        role="button"
        aria-label="Jump to FAQ search"
        onClick={() => {
          const el = document.getElementById("faq-search-bar");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => searchInputRef.current?.focus(), 500);
          }
        }}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            const el = document.getElementById("faq-search-bar");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(() => searchInputRef.current?.focus(), 500);
            }
          }
        }}
      >
        <motion.div
          className="bg-[#00ffff] rounded-full p-3 shadow-2xl border-4 border-[#00cccc] animate-bounce group-hover:scale-110 transition-transform"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <FaQuestionCircle className="text-3xl text-gray-900" />
        </motion.div>
        <span className="mt-2 text-xs text-[#00ffff] font-bold bg-gray-900 px-2 py-1 rounded-full shadow group-hover:bg-[#00ffff] group-hover:text-gray-900 transition-colors">Need help?</span>
      </motion.div>
    </div>
  );
}
