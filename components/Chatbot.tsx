"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/utils/axiosInstance';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  rating?: 'up' | 'down' | null;
  action?: {
    type: string;
    url: string;
    message: string;
  };
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        text: "👋 Hi! I'm your shopping assistant. I can help you find products, track orders, and answer questions. What are you looking for today?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
    setMessageIdCounter(2);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    setHasNewMessage(false);
    setIsMinimized(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${messageIdCounter}`,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageIdCounter(prev => prev + 1);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axiosInstance.post('/api/chatbot/chat', {
        message: inputMessage,
        userId: `user_${Date.now()}`
      });

      // Realistic typing delay
      const typingDelay = Math.min(Math.max(response.data.response.length * 25, 1000), 2000);

      setTimeout(() => {
        const botMessage: Message = {
          id: `bot-${messageIdCounter + 1}`,
          text: response.data.response,
          isBot: true,
          timestamp: new Date(),
          action: response.data.action
        };

        setMessages(prev => [...prev, botMessage]);
        setMessageIdCounter(prev => prev + 2);
        setIsTyping(false);
        
        // Handle bot actions (like redirects)
        if (response.data.action && response.data.action.type === 'redirect') {
          setTimeout(() => {
            window.location.href = response.data.action.url;
          }, 1500); // Give user time to read the message
        }
        
        if (!isOpen) {
          setHasNewMessage(true);
        }
      }, typingDelay);

    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorResponse = (error as { 
        response?: { 
          data?: { 
            response?: string;
          } 
        } 
      }).response?.data;
      
      const errorMessage: Message = {
        id: `error-${messageIdCounter + 1}`,
        text: errorResponse?.response || "I'm experiencing technical difficulties. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setMessageIdCounter(prev => prev + 2);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const rateMessage = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-6 sm:right-6">
        <div className="relative">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleOpen();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: isOpen ? 1 : [1, 1.02, 1],
            }}
            transition={{
              scale: {
                duration: isOpen ? 0.2 : 2,
                repeat: isOpen ? 0 : Infinity,
                ease: "easeInOut"
              }
            }}
            className="rounded-full w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#00ffff] to-[#00cccc] hover:from-[#00cccc] hover:to-[#0099aa] text-black shadow-2xl hover:shadow-3xl transition-colors duration-300 flex items-center justify-center cursor-pointer"
            style={{ 
              zIndex: 9999,
              pointerEvents: 'auto',
              position: 'relative',
              willChange: 'transform'
            }}
            type="button"
          >
            <motion.div
              animate={{ 
                rotate: isOpen ? 180 : 0,
                scale: isOpen ? 0.9 : 1
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              {isOpen ? (
                <X className="h-5 w-5 sm:h-7 sm:w-7" />
              ) : (
                <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7" />
              )}
            </motion.div>
          </motion.button>
          
          {/* Notification Badge */}
          <AnimatePresence>
            {hasNewMessage && !isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
              >
                1
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulsing Ring Animation */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-[#00ffff] pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              y: 50, 
              scale: 0.9,
              transformOrigin: "bottom right"
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transformOrigin: "bottom right"
            }}
            exit={{ 
              opacity: 0, 
              y: 30, 
              scale: 0.95,
              transformOrigin: "bottom right"
            }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 400,
              mass: 0.8,
              duration: 0.4
            }}
            className={`fixed bottom-16 right-2 left-2 sm:bottom-20 sm:right-4 sm:left-auto sm:w-96 md:bottom-24 md:right-6 md:w-96 bg-gray-900/95 backdrop-blur-xl border border-[#00ffff]/30 rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden ${
              isMinimized 
                ? "max-h-20" 
                : "max-h-[85vh] sm:max-h-[500px]"
            }`}
            style={{
              willChange: 'transform, opacity'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black/20 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-lg truncate">OwnShopy Assistant</h3>
                  <p className="text-xs opacity-90 truncate">Always here to help • Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <Button
                  onClick={() => setIsMinimized(!isMinimized)}
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-black/10 p-1 w-6 h-6 sm:w-8 sm:h-8"
                  title={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
                <Button
                  onClick={toggleOpen}
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-black/10 p-1 w-6 h-6 sm:w-8 sm:h-8"
                  title="Close chat"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {isMinimized ? (
              // Minimized State - Show compact preview with click to expand
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="p-3 sm:p-4 bg-gradient-to-b from-gray-900/50 to-gray-900/80 cursor-pointer hover:bg-gray-800/60 transition-colors duration-200"
                onClick={() => setIsMinimized(false)}
                title="Click to expand chat"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black rounded-full flex items-center justify-center animate-pulse">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 truncate">
                      {messages.length > 1 
                        ? messages[messages.length - 1].text 
                        : "Hi! I'm your shopping assistant. Click to expand."
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="text-xs text-gray-500">
                      {messages.length - 1}
                    </div>
                    <Maximize2 className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ) : (
              // Full Chat State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="flex flex-col flex-1 min-h-0"
              >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-900/80 min-h-0">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        damping: 25, 
                        stiffness: 400,
                        mass: 0.5
                      }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[90%] sm:max-w-[85%] ${
                        message.isBot ? '' : 'flex-row-reverse space-x-reverse'
                      }`}>
                        {/* Avatar */}
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.isBot 
                              ? 'bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black' 
                              : 'bg-gradient-to-r from-gray-600 to-gray-500 text-white'
                          }`}
                        >
                          {message.isBot ? (
                            <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                        </motion.div>
                        
                        {/* Message Bubble */}
                        <div className="flex flex-col min-w-0">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl p-2 sm:p-3 relative ${
                              message.isBot 
                                ? 'bg-gray-800/90 text-gray-100 border border-[#00ffff]/20 shadow-lg' 
                                : 'bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black shadow-lg'
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">{message.text}</p>
                            
                            {/* Show action indicator if bot is taking action */}
                            {message.isBot && message.action && (
                              <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                <p className="text-xs text-green-300">
                                  🚀 Taking action: {message.action.type}
                                </p>
                              </div>
                            )}
                            
                            {/* Message Actions */}
                            {message.isBot && (
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
                                <span className="text-xs opacity-60">{formatTime(message.timestamp)}</span>
                                <div className="flex space-x-1">
                                  <Button
                                    onClick={() => rateMessage(message.id, 'up')}
                                    variant="ghost"
                                    size="sm"
                                    className={`p-1 h-5 w-5 sm:h-6 sm:w-6 ${
                                      message.rating === 'up' 
                                        ? 'text-green-400 bg-green-400/10' 
                                        : 'text-gray-400 hover:text-green-400'
                                    }`}
                                  >
                                    <ThumbsUp className="h-2 w-2 sm:h-3 sm:w-3" />
                                  </Button>
                                  <Button
                                    onClick={() => rateMessage(message.id, 'down')}
                                    variant="ghost"
                                    size="sm"
                                    className={`p-1 h-5 w-5 sm:h-6 sm:w-6 ${
                                      message.rating === 'down' 
                                        ? 'text-red-400 bg-red-400/10' 
                                        : 'text-gray-400 hover:text-red-400'
                                    }`}
                                  >
                                    <ThumbsDown className="h-2 w-2 sm:h-3 sm:w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Enhanced Typing Indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-end space-x-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black rounded-full flex items-center justify-center">
                            <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                          <div className="bg-gray-800/90 rounded-2xl p-2 sm:p-3 border border-[#00ffff]/20">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-400 mr-2">Assistant is typing</span>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00ffff] rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00ffff] rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00ffff] rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input */}
                <div className="p-3 sm:p-4 border-t border-gray-800/50 bg-gray-900/70">
                  <div className="flex space-x-2 sm:space-x-3">
                    <div className="flex-1 relative min-w-0">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-xl pr-10 sm:pr-12 focus:border-[#00ffff]/50 focus:ring-[#00ffff]/20 text-sm"
                        disabled={isTyping}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00ffff] p-1 w-6 h-6 sm:w-8 sm:h-8"
                      >
                        <Smile className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-gradient-to-r from-[#00ffff] to-[#00cccc] hover:from-[#00cccc] hover:to-[#0099aa] text-black rounded-xl px-3 py-2 sm:px-4 sm:py-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 transition-all duration-200"
                      >
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center px-2">
                    Press Enter to send • Powered by OwnShopy AI
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
