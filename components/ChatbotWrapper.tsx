"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2, ThumbsUp, ThumbsDown, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/utils/axiosInstance';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: string;
  confidence?: number;
  rating?: 'up' | 'down' | null;
}

const ChatbotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message on first render (no mounting complexity needed)
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        text: "👋 Hello! I'm your personal shopping assistant at OwnShopy! I'm here to help you find amazing products, track orders, and answer any questions. What can I help you with today?",
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
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    setIsMinimized(false);
    // toggled chatbot open state
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
    setShowQuickActions(false);

    try {
      const response = await axiosInstance.post('/api/chatbot/chat', {
        message: inputMessage,
        conversationHistory: messages.map(msg => ({
          role: msg.isBot ? 'assistant' : 'user',
          content: msg.text
        }))
      });

      // Realistic typing delay based on message length
      const typingDelay = Math.min(Math.max(response.data.response.length * 30, 800), 3000);

      setTimeout(() => {
        const botMessage: Message = {
          id: `bot-${messageIdCounter + 1}`,
          text: response.data.response,
          isBot: true,
          timestamp: new Date(),
          category: response.data.category,
          confidence: response.data.confidence
        };

        setMessages(prev => [...prev, botMessage]);
        setMessageIdCounter(prev => prev + 2);
        setIsTyping(false);
        
        if (!isOpen) {
          setHasNewMessage(true);
        }
      }, typingDelay);

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: `error-${messageIdCounter + 1}`,
        text: "😔 I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to contact our support team directly!",
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

  const quickActions = [
    { text: "🛍️ Browse Products", emoji: "🛍️" },
    { text: "📦 Track Order", emoji: "📦" },
    { text: "💰 Check Prices", emoji: "💰" },
    { text: "🎁 Current Deals", emoji: "🎁" },
    { text: "❓ Need Help", emoji: "❓" },
    { text: "📞 Contact Support", emoji: "📞" }
  ];

  const handleQuickAction = (text: string) => {
    setInputMessage(text);
    setTimeout(() => sendMessage(), 100);
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
      <div className="fixed bottom-6 right-6 z-[9999]">
        <div className="relative">
          <button
            onClick={toggleOpen}
            className="rounded-full w-16 h-16 bg-gradient-to-r from-[#00ffff] to-[#00cccc] hover:from-[#00cccc] hover:to-[#0099aa] text-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer"
            type="button"
          >
            {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
          </button>
          
          {/* Notification Badge */}
          <AnimatePresence>
            {hasNewMessage && !isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
              >
                1
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulsing Ring Animation */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#00ffff]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ 
              opacity: 1, 
              y: isMinimized ? 60 : 0, 
              scale: 1,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 bg-gray-900/95 backdrop-blur-xl border border-[#00ffff]/30 rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">OwnShopy Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help • Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setIsMinimized(!isMinimized)}
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-black/10 p-1"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={toggleOpen}
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-black/10 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-900/80">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[85%] ${
                        message.isBot ? '' : 'flex-row-reverse space-x-reverse'
                      }`}>
                        {/* Avatar */}
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.isBot 
                              ? 'bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black' 
                              : 'bg-gradient-to-r from-gray-600 to-gray-500 text-white'
                          }`}
                        >
                          {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </motion.div>
                        
                        {/* Message Bubble */}
                        <div className="flex flex-col">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`rounded-2xl p-3 relative ${
                              message.isBot 
                                ? 'bg-gray-800/90 text-gray-100 border border-[#00ffff]/20 shadow-lg' 
                                : 'bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black shadow-lg'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            
                            {/* Confidence Indicator */}
                            {message.isBot && message.confidence && message.confidence < 80 && (
                              <div className="flex items-center mt-2 text-xs opacity-70">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></div>
                                Learning... {Math.round(message.confidence)}% confident
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
                                    className={`p-1 h-6 w-6 ${
                                      message.rating === 'up' 
                                        ? 'text-green-400 bg-green-400/10' 
                                        : 'text-gray-400 hover:text-green-400'
                                    }`}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={() => rateMessage(message.id, 'down')}
                                    variant="ghost"
                                    size="sm"
                                    className={`p-1 h-6 w-6 ${
                                      message.rating === 'down' 
                                        ? 'text-red-400 bg-red-400/10' 
                                        : 'text-gray-400 hover:text-red-400'
                                    }`}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
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
                          <div className="w-8 h-8 bg-gradient-to-r from-[#00ffff] to-[#00cccc] text-black rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="bg-gray-800/90 rounded-2xl p-3 border border-[#00ffff]/20">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-400 mr-2">Assistant is typing</span>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-2 h-2 bg-[#00ffff] rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                                className="w-2 h-2 bg-[#00ffff] rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                                className="w-2 h-2 bg-[#00ffff] rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <AnimatePresence>
                  {showQuickActions && messages.length <= 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-3 border-t border-gray-800/50 bg-gray-900/50"
                    >
                      <p className="text-xs text-gray-400 mb-3 text-center">✨ Quick Actions</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickAction(action.text)}
                            className="flex items-center space-x-2 p-2 bg-gray-800/50 hover:bg-[#00ffff]/10 border border-gray-700/50 hover:border-[#00ffff]/30 rounded-lg text-left transition-all duration-200"
                          >
                            <span className="text-sm">{action.emoji}</span>
                            <span className="text-xs text-gray-300 truncate">{action.text.replace(action.emoji, '').trim()}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Input */}
                <div className="p-4 border-t border-gray-800/50 bg-gray-900/70">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-xl pr-12 focus:border-[#00ffff]/50 focus:ring-[#00ffff]/20"
                        disabled={isTyping}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00ffff] p-1"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-gradient-to-r from-[#00ffff] to-[#00cccc] hover:from-[#00cccc] hover:to-[#0099aa] text-black rounded-xl px-4 py-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send • Powered by OwnShopy AI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWrapper;
