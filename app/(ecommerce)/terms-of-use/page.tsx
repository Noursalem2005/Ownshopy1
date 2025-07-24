"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShoppingCart, Shield, AlertTriangle, Scale, Users, CreditCard, Truck } from 'lucide-react';

const TermsOfUse = () => {
  const sections = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Account Terms",
      content: [
        "You must be at least 18 years old to create an account and make purchases",
        "You are responsible for maintaining the confidentiality of your account credentials",
        "You agree to provide accurate, current, and complete information during registration",
        "You are responsible for all activities that occur under your account",
        "We reserve the right to suspend or terminate accounts that violate these terms",
        "One person may only maintain one active account at a time"
      ]
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Product Information & Ordering",
      content: [
        "Product descriptions, images, and prices are provided for informational purposes",
        "We strive for accuracy but do not guarantee that all information is error-free",
        "Prices are subject to change without notice until your order is confirmed",
        "We reserve the right to refuse or cancel any order for any reason",
        "All orders are subject to acceptance and product availability",
        "Bulk orders may require special approval and different terms"
      ]
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment & Billing",
      content: [
        "Payment is required at the time of ordering unless otherwise arranged",
        "We accept major credit cards, debit cards, and other payment methods as displayed",
        "You authorize us to charge your payment method for all fees and applicable taxes",
        "If payment fails, we may suspend or cancel your order",
        "Refunds will be processed to the original payment method when applicable",
        "You are responsible for any fees charged by your bank or payment provider"
      ]
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Shipping & Delivery",
      content: [
        "Delivery times are estimates and not guaranteed unless explicitly stated",
        "Risk of loss and title pass to you upon delivery to the shipping carrier",
        "You must provide accurate shipping information; we are not responsible for misdelivered packages due to incorrect addresses",
        "Shipping costs are calculated based on destination, weight, and shipping method selected",
        "International orders may be subject to customs fees, duties, and taxes",
        "We reserve the right to ship via alternative methods if necessary"
      ]
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Returns & Refunds",
      content: [
        "Most items can be returned within 30 days of delivery in original condition",
        "Custom, personalized, or perishable items may not be returnable",
        "Return shipping costs are the customer's responsibility unless the item was defective",
        "Refunds will be processed within 5-10 business days after we receive the returned item",
        "Original shipping charges are non-refundable unless we made an error",
        "Items must be returned in original packaging with all accessories and documentation"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Intellectual Property",
      content: [
        "All content on this website is owned by OwnShopy or our content suppliers",
        "You may not reproduce, distribute, or create derivative works without permission",
        "Trademarks, logos, and service marks displayed are the property of their respective owners",
        "User-generated content (reviews, comments) remains your property but you grant us usage rights",
        "We respect intellectual property rights and will respond to valid takedown notices",
        "Any unauthorized use of our intellectual property may result in legal action"
      ]
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Prohibited Uses",
      content: [
        "You may not use our services for any unlawful or prohibited purpose",
        "No harassment, abuse, or harmful behavior toward other users or our staff",
        "No attempting to gain unauthorized access to our systems or data",
        "No uploading malicious code, viruses, or harmful software",
        "No fraudulent activities, including false reviews or fake accounts",
        "No reselling of products without proper authorization where required by law"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] p-4 rounded-full">
              <FileText className="h-8 w-8 text-gray-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Use</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            These terms govern your use of OwnShopy and outline the rights and responsibilities of both parties.
          </p>
          <div className="mt-6 text-sm text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-2">By using our services, you agree to these terms.</p>
          </div>
        </motion.div>

        {/* Acceptance Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-[#00ffff]/10 to-[#2afdfd]/10 border border-[#00ffff]/30 rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Agreement to Terms</h2>
          <p className="text-gray-300 mb-4">
            By accessing and using OwnShopy, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#00ffff]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="h-6 w-6 text-[#00ffff]" />
              </div>
              <p className="text-sm font-semibold text-white">Legal Agreement</p>
              <p className="text-xs text-gray-400">Binding contract between you and OwnShopy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#00ffff]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-[#00ffff]" />
              </div>
              <p className="text-sm font-semibold text-white">Your Protection</p>
              <p className="text-xs text-gray-400">Clear rights and responsibilities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#00ffff]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-[#00ffff]" />
              </div>
              <p className="text-sm font-semibold text-white">Fair Usage</p>
              <p className="text-xs text-gray-400">Guidelines for appropriate use</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] p-3 rounded-lg mr-4">
                  {React.cloneElement(section.icon, { className: "h-6 w-6 text-gray-900" })}
                </div>
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00ffff] to-[#2afdfd] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mt-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            Limitation of Liability
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Disclaimer:</strong> Our products and services are provided &ldquo;as is&rdquo; without any warranty of any kind, 
              either expressed or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.
            </p>
            <p>
              <strong>Limitation:</strong> In no event shall OwnShopy be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your use of our services.
            </p>
            <p>
              <strong>Maximum Liability:</strong> Our total liability to you for any claim arising out of or relating to 
              these terms or our services shall not exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </div>
        </motion.div>

        {/* Governing Law */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 mt-8 text-white"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Scale className="h-6 w-6 mr-3" />
            Governing Law & Disputes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Applicable Law</h3>
              <p className="text-gray-300 text-sm mb-4">
                These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                without regard to its conflict of law provisions.
              </p>
              <h3 className="font-semibold mb-3">Dispute Resolution</h3>
              <p className="text-gray-300 text-sm">
                Any disputes arising out of these terms shall be resolved through binding arbitration or in the courts 
                of [Your Jurisdiction].
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact for Legal Matters</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@ownshopy.com</p>
                <p><strong>Address:</strong> OwnShopy Legal Department, [Your Address]</p>
                <p><strong>Response Time:</strong> Legal inquiries answered within 5 business days</p>
              </div>
              <button className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:from-[#2afdfd] hover:to-[#00ffff] transition-all duration-300 mt-4">
                Contact Legal Team
              </button>
            </div>
          </div>
        </motion.div>

        {/* Changes to Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8"
        >
          <h3 className="font-semibold text-blue-800 mb-2">Changes to These Terms</h3>
          <p className="text-blue-700 text-sm">
            We reserve the right to modify these terms at any time. We will notify users of significant changes via email 
            or prominent website notice. Your continued use of our services after changes constitutes acceptance of the new terms. 
            We recommend reviewing these terms periodically.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUse;
