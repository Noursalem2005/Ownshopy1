/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleClientScriptLoad } from "next/script";
import { Button } from "./ui/button";
import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User as UserIcon, Bell, LogOut, HelpCircle, ChevronDown } from "lucide-react";
import axiosInstance from "../utils/axiosInstance"; // Adjust the import path as necessary
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Mobile Support Dropdown Component
const MobileSupportDropdown = ({ handleMenuItemClick }: { handleMenuItemClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        className="flex items-center justify-between w-full text-gray-300 hover:text-[#00ffff] py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Support</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 flex flex-col space-y-2 py-2"
          >
            <Link href="/about" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              About Us
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              Contact Us
            </Link>
            <Link href="/faqs" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              FAQs
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile User Dropdown Component
const MobileUserDropdown = ({ 
  user, 
  handleMenuItemClick, 
  handlelogout 
}: { 
  user: { name?: string; email?: string; photo?: string } | null, 
  handleMenuItemClick: () => void, 
  handlelogout: () => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        className="flex items-center justify-between w-full text-gray-300 hover:text-[#00ffff] py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Account</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 flex flex-col space-y-2 py-2"
          >
            <Link href="/profile" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              Profile
            </Link>
            <Link href="/notifications" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              Notifications
            </Link>
            <Link href="/orders" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              Orders
            </Link>
            <div className="w-full border-t border-gray-600/30 my-2" />
            <button
              onClick={() => {
                handlelogout();
                handleMenuItemClick();
              }}
              className="text-red-400 hover:text-red-300 py-2 text-sm text-left w-full"
            >
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile User Account Dropdown Component (without logout)
const MobileAccountDropdown = ({ 
  user, 
  handleMenuItemClick
}: { 
  user: { name?: string; email?: string; photo?: string } | null, 
  handleMenuItemClick: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        className="flex items-center justify-between w-full text-gray-300 hover:text-[#00ffff] py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Account</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 flex flex-col space-y-2 py-2"
          >
            <Link href="/profile" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              Profile
            </Link>
            <Link href="/notifications" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              Notifications
            </Link>
            <Link href="/orders" className="text-gray-400 hover:text-[#00ffff] py-2 text-sm" onClick={handleMenuItemClick}>
              Orders
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingText, setTypingText] = useState("");
  const { user, refreshUser } = useAuth(); // Get refreshUser from AuthContext
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { wishlist, clearWishlist } = useWishlist();
  const { cart, clearCart } = useCart();
  const wishlistCount = wishlist ? wishlist.size : 0;
  const cartCount = cart && cart.items ? cart.items.length : 0;

  useEffect(() => {
    const handleclickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [searchRef, mobileMenuRef]);

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handlelogout = async () => {
    try {
      const repsonse = await axiosInstance.post("/api/auth/logout");
      if (repsonse.status === 200) {
        // Clear user state by calling refreshUser (which will get 401 and set user to null)
        await refreshUser();
        clearWishlist();
        // Don't clear cart - let it persist in database for when user logs back in
        // clearCart();
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  // Remove the redundant getUserSession call since AuthContext handles user state
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (isSearchOpen) {
      const text = "Search products....";
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setTypingText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    } else {
      setTypingText("");
    }
  }, [isSearchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length) {
      router.push(`/search?searchTerm=${searchQuery}`);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar ${
        isScrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.span
                className="text-transparent text-2xl font-bold bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#00cccc]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                OwnShopy{" "}
              </motion.span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {/* Support Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-[#00ffff] hover:bg-transparent transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Support</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-gray-800"
                align="start"
              >
                <DropdownMenuItem className="dropdown-item">
                  <Link href="/about" className="flex w-full text-gray-300 hover:text-[#00ffff]">
                    About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <Link href="/contact" className="flex w-full text-gray-300 hover:text-[#00ffff]">
                    Contact Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <Link href="/faqs" className="flex w-full text-gray-300 hover:text-[#00ffff]">
                    FAQs
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <motion.div
              className="relative"
              initial={false}
              animate={isSearchOpen ? "open" : "closed"}
              ref={searchRef}
            >
              <motion.form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
                variants={{
                  open: { width: "300px" },
                  closed: { width: "35px" },
                }}
              >
                <Input
                  type="text"
                  placeholder={typingText || "Search..."}
                  value={searchQuery}
                  className="search-input"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-[#00ffff] text-black rounded-r-md hover:bg-[#00cccc] transition-colors"
                  onClick={() => !isSearchOpen && setIsSearchOpen(true)}
                  size="icon"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.form>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/wishlist">
                <Button size="icon" className="relative bg-transparent hover:bg-transparent">
                  <Heart className="h-5 w-5 text-gray-300 hover:text-[#00ffff] transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow border-2 border-gray-900 animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart">
                <Button size="icon" className="relative bg-transparent hover:bg-transparent">
                  <ShoppingCart className="h-5 w-5 text-gray-300 hover:text-[#00ffff] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#00ffff] text-gray-900 text-xs font-bold rounded-full px-1.5 py-0.5 shadow border-2 border-gray-900 animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </motion.div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-transparent"
                  >
                    <Avatar className="h-8 w-8 border-2 border-[#00ffff]/30 hover:border-[#00ffff] transition-colors">
                      {user.photo && (
                        <AvatarImage 
                          src={user.photo} 
                          alt={user.name || "User"} 
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-[#1e293b] text-[#00ffff] font-semibold border border-[#00ffff]/20">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className=" bg-gray-800 w-52"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-[#00ffff]">
                        {(user.name || "User").split(" ").slice(0, 3).join(" ")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user.email || "No email provided"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem className="dropdown-item">
                    <Link href="/profile" className="flex w-full items-center text-gray-300 hover:text-[#00ffff]">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dropdown-item">
                    <Link href="/notifications" className="flex w-full items-center text-gray-300 hover:text-[#00ffff]">
                      <Bell className="h-4 w-4 mr-2" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dropdown-item">
                    <Link href="/orders" className="flex w-full items-center text-gray-300 hover:text-[#00ffff]">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem
                    className="dropdown-item text-red-400 hover:text-red-300"
                    onClick={handlelogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link href="/auth?type=login">
                    <Button className="bg-transparent text-[#00ffff] border border-[#00ffff] hover:bg-[#00ffff] transition-colors cursor-pointer hover:text-black">
                      Login
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link href="/auth?type=signup">
                    <Button className="bg-[#00ffff] text-black  hover:bg-[#00cccc] transition-colors cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center space-x-2">
            {/* Cart icon for mobile */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/cart">
                <Button size="icon" className="relative bg-transparent hover:bg-transparent p-2">
                  <ShoppingCart className="h-5 w-5 text-gray-300 hover:text-[#00ffff] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#00ffff] text-gray-900 text-xs font-bold rounded-full px-1.5 py-0.5 shadow border-2 border-gray-900 animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </motion.div>
            
            {/* Hamburger menu button */}
            <motion.button
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00ffff]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          //the avatar with the email of theuser
          // and the name of the user

          <motion.div
            className="absolute top-16 left-0 right-0 bg-[#1e293b] text-white md:hidden border-t border-gray-600 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            ref={mobileMenuRef}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="flex flex-col items-stretch justify-between mb-4 w-full">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full flex-row items-stretch gap-2"
                >
                  <Input
                    type="text"
                    placeholder={typingText || "Search..."}
                    value={searchQuery}
                    className="search-input flex-1"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="px-4 py-2 bg-[#00ffff] text-black rounded-md hover:bg-[#00cccc] transition-colors flex-shrink-0"
                  >
                    <Search className="h-5 w-5 mx-auto" />
                  </Button>
                </form>
              </div>
              
              {user && (
                <>
                  <div className="flex items-center space-x-3 mb-4 px-3 py-2 bg-[#0f172a] rounded-lg shadow border border-[#00ffff]/20">
                    <Avatar className="h-10 w-10 border-2 border-[#00ffff]/30">
                      {user.photo && (
                        <AvatarImage 
                          src={user.photo} 
                          alt={user.name || "User"} 
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-[#1e293b] text-[#00ffff] font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ml-2">
                      <span className="text-sm font-medium text-[#00ffff] leading-tight">
                        {(user.name || "User").split(" ").slice(0, 2).join(" ")}
                      </span>
                      <span className="text-xs text-gray-400 break-all leading-tight">
                        {user.email || "No email"}
                      </span>
                    </div>
                  </div>
                  <div className="w-full border-t border-[#00ffff]/20 mb-4" />
                </>
              )}
              
              <div className="flex flex-col space-y-2">
                <Link href="/" className="text-gray-300 hover:text-[#00ffff] py-3" onClick={handleMenuItemClick}>
                  Home
                </Link>
                <div className="w-3/4 border-b border-gray-600/40 ml-0" />
                
                <Link href="/wishlist" className="text-gray-300 hover:text-[#00ffff] py-3" onClick={handleMenuItemClick}>
                  Liked List
                </Link>
                <div className="w-3/4 border-b border-gray-600/40 ml-0" />
                
                {/* Support Category with Dropdown */}
                <MobileSupportDropdown handleMenuItemClick={handleMenuItemClick} />
                <div className="w-3/4 border-b border-gray-600/40 ml-0" />
                
                {user ? (
                  <>
                    {/* User Account Category with Dropdown (without logout) */}
                    <MobileAccountDropdown user={user} handleMenuItemClick={handleMenuItemClick} />
                    
                    {/* Logout separated */}
                    <div className="pt-2 mt-2 border-t border-[#00ffff]/20">
                      <button
                        onClick={() => {
                          handlelogout();
                          handleMenuItemClick();
                        }}
                        className="text-red-400 hover:text-red-300 py-3 text-left w-full"
                      >
                        Log Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col space-y-3 pt-2">
                      <Link href="/auth?type=login" onClick={handleMenuItemClick}>
                        <Button className="w-full bg-transparent text-[#00ffff] border border-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors duration-300 py-3 rounded-lg font-medium">
                          Login
                        </Button>
                      </Link>
                      
                      <Link href="/auth?type=signup" onClick={handleMenuItemClick}>
                        <Button className="w-full bg-[#00ffff] text-black hover:bg-[#00cccc] transition-colors duration-300 py-3 rounded-lg font-medium shadow-lg">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
