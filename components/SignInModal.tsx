import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn?: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose, onSignIn }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-xl p-8 shadow-lg border border-[#00ffff30] w-full max-w-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <h3 className="text-lg font-bold text-[#00ffff] mb-4">Sign In Required</h3>
            <p className="mb-4 text-gray-300">You need to sign in to add items to your cart or wishlist.</p>
            <div className="flex gap-2 justify-end">
              <Button className="bg-gray-700 text-white hover:bg-gray-600" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-[#00ffff] text-black hover:bg-[#00cccc] font-bold" onClick={onSignIn}>
                Sign In
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;
