import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChatAlt2, HiOutlineX, HiOutlinePaperAirplane, HiOutlineSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Get base URL from env or use standard fallback for dev
const API_URL = 'http://localhost:5000/api';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth(); // for context

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(),
        sender: 'bot',
        text: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your AI Career Assistant. How can I help you today?`
      }]);
    }
  };

  const sendMessage = async (presetMessage = null) => {
    const text = presetMessage || inputMsg;
    if (!text.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: text,
        history: messages.map(m => ({ sender: m.sender, text: m.text })),
        user_profile: user ? {
          name: user.name,
          department: user.department,
          skills: user.skills || []
        } : {}
      });

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: response.data.reply
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting to the AI brain right now.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const presetQuestions = [
    "Which internships suit me?",
    "What should I learn next?",
    "Why was I rejected?"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 z-50 group hover:shadow-xl transition-all"
        >
          <HiOutlineChatAlt2 className="text-3xl group-hover:scale-110 transition-transform" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-2 text-white">
                <HiOutlineSparkles className="text-xl text-yellow-300" />
                <span className="font-bold">Career Assistant AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-indigo-100 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-sm' 
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl rounded-bl-sm p-3 w-16 flex justify-center gap-1 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset Query Bubbles */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex gap-2 overflow-x-auto select-none py-1 pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q)}
                    className="whitespace-nowrap flex-shrink-0 text-xs bg-slate-800 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-slate-700/60 bg-slate-800/80">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-full pl-4 pr-12 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light placeholder-slate-500 shadow-inner"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMsg.trim() || isTyping}
                  className="absolute right-1 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HiOutlinePaperAirplane className="transform rotate-90 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
