"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  FaRocket, 
  FaUsers, 
  FaShieldAlt, 
  FaHeart,
  FaGlobe,
  FaTruck,
  FaHeadset,
  FaStar,
  FaAward,
  FaChartLine,
  FaLightbulb,
  FaHandshake
} from "react-icons/fa";

const AboutPage = () => {
  const values = [
    {
      icon: FaHeart,
      title: "Customer Excellence",
      description: "We prioritize our customers' satisfaction above everything else, ensuring every interaction is meaningful and adds value to their shopping experience."
    },
    {
      icon: FaShieldAlt,
      title: "Quality Assurance",
      description: "Every product goes through rigorous quality checks and testing to ensure you receive only the finest items that meet our high standards."
    },
    {
      icon: FaGlobe,
      title: "Global Reach",
      description: "Serving customers worldwide with fast, reliable shipping and localized customer support that understands your needs."
    },
    {
      icon: FaRocket,
      title: "Innovation",
      description: "Constantly evolving our platform with cutting-edge technology and features to enhance your shopping experience."
    }
  ];

  const features = [
    {
      icon: FaTruck,
      title: "Lightning Fast Delivery",
      description: "Free shipping on orders over $100, with express delivery options and real-time tracking available worldwide."
    },
    {
      icon: FaHeadset,
      title: "24/7 Expert Support",
      description: "Our dedicated customer service team is here to help you around the clock with any questions or concerns."
    },
    {
      icon: FaAward,
      title: "Premium Quality",
      description: "Curated selection of high-quality products from trusted brands and verified sellers worldwide."
    }
  ];

  const stats = [
    { number: "1M+", label: "Happy Customers", icon: FaUsers },
    { number: "50K+", label: "Products Available", icon: FaStar },
    { number: "99.9%", label: "Uptime Guarantee", icon: FaChartLine },
    { number: "24/7", label: "Customer Support", icon: FaHeadset }
  ];

  const team = [
    {
      role: "Innovation",
      title: "Cutting-Edge Technology",
      description: "We leverage the latest technologies to provide you with a seamless, secure, and enjoyable shopping experience.",
      icon: FaLightbulb
    },
    {
      role: "Partnership",
      title: "Trusted Relationships",
      description: "Building strong partnerships with suppliers and customers to create lasting value for everyone involved.",
      icon: FaHandshake
    },
    {
      role: "Growth",
      title: "Continuous Improvement",
      description: "Always evolving, always improving. We listen to feedback and constantly enhance our platform.",
      icon: FaChartLine
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <motion.section 
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-6">
              About OwnShopy
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing e-commerce with cutting-edge technology, exceptional service, and a commitment to customer excellence.
            </p>
          </motion.div>
          
          <motion.div
            className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full">
                  <span className="text-cyan-300 font-semibold text-sm">OUR STORY</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                  Building the Future of 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"> E-Commerce</span>
                </h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    Founded in 2020, OwnShopy emerged from a simple yet powerful vision: to create an online marketplace 
                    that genuinely puts customers at the center of everything we do. What started as a passionate team 
                    with big dreams has evolved into a global platform serving millions of satisfied customers worldwide.
                  </p>
                  <p>
                    We believe that shopping should transcend mere transactions. It should be an inspiring experience 
                    that connects people with products that genuinely enhance their lives, backed by service that 
                    exceeds expectations at every touchpoint.
                  </p>
                  <p>
                    Today, we&apos;re proud to offer over 50,000 carefully curated products from trusted brands and verified 
                    sellers, supported by industry-leading customer service and innovative technology that makes shopping 
                    effortless and enjoyable.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl transform rotate-3"></div>
                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
                  <Image
                    src="/banner1.webp"
                    alt="Our Story"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-6">
              <span className="text-cyan-300 font-semibold text-sm">OUR VALUES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our core values guide every decision we make and every interaction we have with our customers.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700/50 group-hover:border-cyan-400/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-6">
              <span className="text-cyan-300 font-semibold text-sm">WHY CHOOSE US</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what makes OwnShopy the preferred choice for discerning customers worldwide.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700/50 group-hover:border-cyan-400/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-6">
              <span className="text-cyan-300 font-semibold text-sm">OUR APPROACH</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              How We Make It Happen
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our commitment to excellence is reflected in everything we do, from technology to customer relationships.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700/50 group-hover:border-cyan-400/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-4">
                      <span className="text-cyan-300 font-semibold text-xs uppercase tracking-wider">{item.role}</span>
                    </div>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Experience 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"> Excellence?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join millions of satisfied customers who have made OwnShopy their trusted shopping destination.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Shopping Now
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold rounded-xl hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
