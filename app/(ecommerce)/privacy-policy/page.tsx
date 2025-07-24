"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Database, UserCheck, Lock, Globe, Mail, Clock } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, shipping and billing addresses",
        "Account Information: Username, password, and account preferences",
        "Payment Information: Credit card details, billing information (processed securely through payment processors)",
        "Technical Information: IP address, browser type, device information, operating system",
        "Usage Data: Pages visited, time spent on site, click patterns, search queries",
        "Cookies and Tracking: Session data, preferences, analytics information"
      ]
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders and transactions",
        "Provide customer support and respond to inquiries",
        "Send order confirmations, shipping updates, and important account information",
        "Personalize your shopping experience and recommend products",
        "Improve our website, products, and services",
        "Prevent fraud and ensure security of our platform",
        "Comply with legal obligations and resolve disputes",
        "Send promotional emails (with your consent, which you can withdraw anytime)"
      ]
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Information Sharing",
      content: [
        "Service Providers: Third-party companies that help us operate our business (payment processors, shipping companies, email services)",
        "Legal Requirements: When required by law, court order, or to protect our rights and safety",
        "Business Transfers: In case of merger, acquisition, or sale of our business",
        "With Your Consent: When you explicitly agree to share information with third parties",
        "We do NOT sell, rent, or trade your personal information to third parties for marketing purposes"
      ]
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Security",
      content: [
        "SSL encryption for all data transmission",
        "Secure payment processing through PCI DSS compliant processors",
        "Regular security audits and vulnerability assessments",
        "Access controls and employee training on data protection",
        "Secure data storage with encryption at rest",
        "Regular backups and disaster recovery procedures",
        "Incident response plan for potential security breaches"
      ]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Your Rights",
      content: [
        "Access: Request a copy of the personal information we hold about you",
        "Correction: Update or correct inaccurate personal information",
        "Deletion: Request deletion of your personal information (subject to legal requirements)",
        "Portability: Receive your data in a structured, machine-readable format",
        "Objection: Object to certain types of processing of your information",
        "Restriction: Request limitation of processing your personal information",
        "Withdraw Consent: Opt-out of marketing communications at any time"
      ]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Data Retention",
      content: [
        "Account Information: Retained while your account is active and for up to 7 years after closure",
        "Order History: Kept for 7 years for tax and legal compliance purposes",
        "Marketing Data: Until you unsubscribe or request deletion",
        "Technical Logs: Typically retained for 12 months for security and analytics",
        "Support Communications: Kept for 3 years to improve customer service",
        "We regularly review and delete data that is no longer necessary"
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
              <Shield className="h-8 w-8 text-gray-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use OwnShopy.
          </p>
          <div className="mt-6 text-sm text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </motion.div>

        {/* Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-[#00ffff]/10 to-[#2afdfd]/10 border border-[#00ffff]/30 rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Quick Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#00ffff] mb-2">What we collect:</h3>
              <p className="text-gray-300 text-sm">Personal info, order data, usage analytics, and technical information to provide our services.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#00ffff] mb-2">How we use it:</h3>
              <p className="text-gray-300 text-sm">To process orders, improve your experience, provide support, and keep our platform secure.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#00ffff] mb-2">Your control:</h3>
              <p className="text-gray-300 text-sm">Access, update, or delete your data anytime. Opt-out of marketing communications easily.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Security:</h3>
              <p className="text-gray-600 text-sm">Industry-standard encryption, secure payment processing, and regular security audits.</p>
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

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 mt-12 text-white border border-[#00ffff]/30"
        >
          <div className="flex items-center mb-6">
            <Mail className="h-6 w-6 mr-3" />
            <h2 className="text-2xl font-semibold">Contact Us About Privacy</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> privacy@ownshopy.com</p>
                <p className="text-sm"><strong>Address:</strong> OwnShopy Privacy Team, [Your Address]</p>
                <p className="text-sm"><strong>Response Time:</strong> We respond to privacy inquiries within 48 hours</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Your Rights Requests</h3>
              <p className="text-gray-300 text-sm mb-4">
                To exercise your privacy rights (access, correction, deletion), please use our contact form or email us directly.
              </p>
              <button className="bg-gradient-to-r from-[#00ffff] to-[#2afdfd] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:from-[#2afdfd] hover:to-[#00ffff] transition-all duration-300">
                Contact Privacy Team
              </button>
            </div>
          </div>
        </motion.div>

        {/* Updates Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-[#00ffff]/10 to-[#2afdfd]/10 border border-[#00ffff]/30 rounded-xl p-6 mt-8"
        >
          <h3 className="font-semibold text-[#00ffff] mb-2">Policy Updates</h3>
          <p className="text-gray-300 text-sm">
            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice on our website. Your continued use of our services after changes indicates your acceptance of the updated policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
