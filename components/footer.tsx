"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      className="bg-card text-card-foreground border-t border-border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="flex flex-col items-center justify-center col-span-1">
            <div className="flex items-center justify-center space-x-3">
              <Image
                src="/ChatGPT Image Apr 30, 2025, 10_08_53 PM.png"
                alt="Logo"
                width={75}
                height={75}
                className="rounded-md border-1 border-[#00ffff] shadow-lg object-cover"
              />
              <motion.span className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                OwnShopy
              </motion.span>
            </div>
            <p className="text-muted-foreground text-base text-left md:text-center xl:text-center mt-4">
              Your one-stop shop for the latest products, best deals, and
              amazing customer service.
            </p>
            <div className="flex items-center justify-center space-x-3 mt-4">
              <motion.a
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary"
                whileTap={{ y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                className="text-gray-400 hover:text-[#00ffff]"
                whileTap={{ y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                className="text-gray-400 hover:text-[#00ffff]"
                whileTap={{ y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Products
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    {
                      label: "smartphones",
                      category: "Smartphones",
                    },
                    {
                      label: "wearables",
                      category: "Wearables",
                    },
                    {
                      label: "food & beverages",
                      category: "Food",
                    },
                    {
                      label: "electronics",
                      category: "Headphones",
                    },
                  ].map((item) => (
                    <motion.li
                      key={item.label}
                      whileHover={{ x: 2, color: "#00ffff" }}
                    >
                      <a
                        className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                        href={`/search?category=${encodeURIComponent(item.category)}`}
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semiold text-gray-200 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <Link
                      href="/contact"
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                    >
                      Contact Us
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <Link
                      href="/faqs"
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                    >
                      FAQs
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <motion.a
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                      href="/returns"
                    >
                      Returns
                    </motion.a>
                  </motion.li>
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <motion.a
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                      href="/shipping"
                    >
                      Shipping
                    </motion.a>
                  </motion.li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <Link
                      href="/about"
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                    >
                      About Us
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <motion.a
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                      href="/careers"
                    >
                      Careers
                    </motion.a>
                  </motion.li>
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <motion.a
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                      href="/press"
                    >
                      Press
                    </motion.a>
                  </motion.li>
                  <motion.li whileHover={{ x: 2, color: "#00ffff" }}>
                    <motion.a
                      className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                      href="/blog"
                    >
                      Blog
                    </motion.a>
                  </motion.li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                    (item) => (
                      <motion.li
                        key={item}
                        whileHover={{ x: 2, color: "#00ffff" }}
                      >
                        <motion.a
                          className="text-base text-gray-400 hover:text-[#00ffff] transition-colors"
                          href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                        >
                          {item}
                        </motion.a>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} OwnShopy. All rights reserved.
          </p>
          <div className="mt-2 flex flex-col items-center justify-center gap-1">
            <span className="text-sm text-gray-400">
              This website made by{" "}
              <a
                href="https://github.com/Noursalem2005"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ffff] hover:underline"
              >
                Nour Salem
              </a>
              .
            </span>
            <div className="flex space-x-4 mt-1">
              <a
                href="https://github.com/Noursalem2005"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00ffff] transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/nour-salem-43a380201?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00ffff] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
export default Footer;
