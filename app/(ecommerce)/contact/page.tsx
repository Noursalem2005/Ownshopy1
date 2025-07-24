"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/utils/env";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaHeadset,
  FaQuestionCircle,
  FaBug,
  FaWhatsapp
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      info: "zoeparker2672@gmail.com",
      description: "Get in touch via email",
      color: "text-blue-400"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      info: "+201203917464",
      description: "Mon-Fri 9AM-6PM EET",
      color: "text-green-400"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      info: "Alexandria, Egypt",
      description: "Our headquarters",
      color: "text-red-400"
    },
    {
      icon: FaClock,
      title: "Business Hours",
      info: "24/7 Online Support",
      description: "Always here to help",
      color: "text-purple-400"
    }
  ];

  const supportTypes = [
    { icon: FaHeadset, label: "Customer Support", value: "support", color: "text-cyan-400" },
    { icon: FaQuestionCircle, label: "General Inquiry", value: "general", color: "text-blue-400" },
    { icon: FaBug, label: "Technical Issue", value: "technical", color: "text-red-400" },
    { icon: FaPaperPlane, label: "Partnership", value: "partnership", color: "text-green-400" }
  ];

  const socialLinks = [
    { icon: FaWhatsapp, href: "https://wa.me/201203917464", color: "text-green-500" },
    { icon: FaFacebook, href: "https://facebook.com", color: "text-blue-600" },
    { icon: FaTwitter, href: "https://twitter.com", color: "text-blue-400" },
    { icon: FaInstagram, href: "https://instagram.com", color: "text-pink-500" },
    { icon: FaLinkedin, href: "https://linkedin.com", color: "text-blue-700" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(env.API_CONTACT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "", type: "general" });
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <motion.section
        className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Have questions, suggestions, or need support? We&apos;d love to hear from you! 
            Our team is here to help you with anything you need.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-cyan-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full mb-4 ${info.color}`}>
                      <info.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                    <p className="text-cyan-300 font-medium mb-1">{info.info}</p>
                    <p className="text-gray-400 text-sm">{info.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
                    <FaPaperPlane className="text-cyan-400" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Support Type Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-3 block">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {supportTypes.map((type) => (
                          <motion.button
                            key={type.value}
                            type="button"
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 text-sm ${
                              formData.type === type.value
                                ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                                : "border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500"
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                            whileTap={{ scale: 0.95 }}
                          >
                            <type.icon className={`text-lg ${formData.type === type.value ? 'text-cyan-300' : type.color}`} />
                            <span className="font-medium">{type.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Name and Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-300 mb-2 block">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white focus:border-cyan-400"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2 block">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white focus:border-cyan-400"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="text-sm font-medium text-gray-300 mb-2 block">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white focus:border-cyan-400"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="text-sm font-medium text-gray-300 mb-2 block">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white focus:border-cyan-400 min-h-[120px] resize-none"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3"
                    >
                      {isSubmitting ? (
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
                          Sending...
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaPaperPlane />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* FAQ Section */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                    <FaQuestionCircle className="text-cyan-400" />
                    Quick Answers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">How fast do you respond?</h4>
                    <p className="text-gray-300 text-sm">We typically respond to all inquiries within 2-4 hours during business hours.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Need immediate help?</h4>
                    <p className="text-gray-300 text-sm">Check our FAQ page for instant answers to common questions.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Technical issues?</h4>
                    <p className="text-gray-300 text-sm">Include your browser, device info, and screenshots for faster resolution.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-cyan-300">
                    Connect With Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    Follow us on social media for updates, tips, and community discussions.
                  </p>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 bg-gray-700/50 rounded-full hover:bg-gray-600/50 transition-colors ${social.color}`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon className="w-6 h-6" />
                      </motion.a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                    <FaClock className="text-cyan-400" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Monday - Friday</span>
                    <span className="text-white font-medium">9:00 AM - 6:00 PM EET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Saturday</span>
                    <span className="text-white font-medium">10:00 AM - 4:00 PM EET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sunday</span>
                    <span className="text-white font-medium">12:00 PM - 4:00 PM EET</span>
                  </div>
                  <div className="mt-4 p-3 bg-cyan-500/20 rounded-lg">
                    <p className="text-cyan-300 text-sm font-medium">
                      24/7 online support available for urgent issues
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;
