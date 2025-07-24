"use client";
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const SimpleChatTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    console.log('Simple chat toggle clicked!', isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Simple Test Button */}
      <div className="fixed bottom-6 left-6 z-[9999]">
        <button
          onClick={toggleOpen}
          className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer"
          type="button"
        >
          {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
        </button>
      </div>

      {/* Simple Test Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 h-60 bg-white border-2 border-red-500 rounded-lg shadow-lg z-[9998] p-4">
          <h3 className="text-black font-bold mb-2">Test Chat Window</h3>
          <p className="text-black">If you can see this, the basic toggle is working!</p>
          <button 
            onClick={toggleOpen}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default SimpleChatTest;
