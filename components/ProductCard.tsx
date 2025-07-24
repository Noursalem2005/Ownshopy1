import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";
import SignInModal from "./SignInModal";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  _id: string;
  title: string;
  price?: number | string;
  image: string;
  description?: string;
  category?: string;
  rating?: number | string;
}

function renderStars(rating: number | string | undefined) {
  if (!rating) return null;
  const value = typeof rating === "string" ? parseFloat(rating) : rating;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      // Full star
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 inline text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
        </svg>
      );
    } else if (value > i - 1 && value < i) {
      // Half star
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 inline text-yellow-400"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id={`half-gradient-${i}`}>
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-gradient-${i})`}
            d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z"
          />
        </svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 inline text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
        </svg>
      );
    }
  }
  return stars;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  title,
  price,
  image,
  description,
  category,
  rating,
}) => {
  const router = useRouter();
  const { isWished, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showSignIn, setShowSignIn] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Ensure hydration is complete before rendering wishlist state
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Only check wishlist status after hydration
  const isInWishlist = isHydrated ? isWished(_id) : false;

  // Wishlist handler using global state
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowSignIn(true);
      return;
    }
    if (!isInWishlist) {
      try {
        await addToWishlist(_id);
        toast.success("Added to wishlist!");
      } catch {
        toast.error("Failed to add to wishlist.");
      }
    } else {
      try {
        await removeFromWishlist(_id);
        toast.success("Removed from wishlist!");
      } catch {
        toast.error("Failed to remove from wishlist.");
      }
    }
  };

  // Card click handler
  const handleCardClick = () => {
    router.push(`/product/${_id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowSignIn(true);
      return;
    }
    await addToCart(_id, 1);
    toast.success("Added to cart!");
  };

  return (
    <>
      <motion.div
        className="relative bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-default transition-all flex flex-col h-full"
        whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #00ffff40" }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={handleCardClick}
      >
        <div className="relative">
          {/* Heart (wishlist) button */}
          <button
            className={`absolute top-3 right-3 z-30 rounded-full p-2 transition cursor-pointer shadow-md border ${
              isInWishlist
                ? "bg-pink-500 border-pink-500 ring-2 ring-pink-400"
                : "bg-white/80 border-pink-300 hover:bg-pink-200"
            }`}
            onClick={handleAddToWishlist}
            aria-label="Add to wishlist"
          >
            {isInWishlist ? (
              <FaHeart className="text-white drop-shadow-lg" />
            ) : (
              <FaRegHeart className="text-pink-500" />
            )}
          </button>
          {/* Image with larger height, object-contain, and centering, using Next.js Image */}
          <div className="w-full h-64 bg-gray-700 rounded-t-xl overflow-hidden flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={320}
              height={256}
              className="max-h-full max-w-full object-contain object-center"
              style={{ display: 'block' }}
              priority={true}
            />
          </div>
          {/* Category badge */}
          {category && (
            <span className="absolute top-3 left-3 bg-[#00ffff] text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow">
              {category}
            </span>
          )}
          {/* Description overlay */}
          {description && (
            <motion.div
              className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 z-20"
              initial={false}
              animate={false}
            >
              <p className="text-sm text-[#00ffff] text-center break-words line-clamp-3">
                {description}
              </p>
            </motion.div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
            {title}
          </h3>
          {/* Star rating */}
          {rating && (
            <div className="flex items-center mt-1">
              {renderStars(rating)}
              <span className="ml-2 text-xs text-gray-400">{rating}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-[#00ffff]">
              {price !== undefined && price !== null && price !== ""
                ? `${price}`
                : "No price"}
            </span>
          </div>
          <Button
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#00ffff] text-gray-900 font-bold hover:bg-[#00cccc] active:scale-95 active:shadow-xl transition rounded-b-xl cursor-pointer border-2 border-[#00ffff] shadow-md"
            onClick={handleAddToCart}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V5a2 2 0 10-4 0v4" />
            </svg>
            Add to Cart
          </Button>
        </div>
      </motion.div>
      <SignInModal
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={() => {
          setShowSignIn(false);
          router.push("/auth?type=login");
        }}
      />
    </>
  );
};

export default ProductCard;