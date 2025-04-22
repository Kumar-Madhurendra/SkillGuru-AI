import React, { useState, FormEvent } from 'react';
import useChat from '../hooks/useChat';
import { motion } from 'framer-motion';
import { useThemeContext } from './ThemeProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isAITyping } = useChat();
  const { isDarkMode } = useThemeContext();
  const hasSelectedSubject = useSelector((state: RootState) => state.chat.hasSelectedSubject);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !hasSelectedSubject) return;

    sendMessage(input);
    setInput('');
  };

  // Determine placeholder text based on state
  const getPlaceholderText = () => {
    if (!hasSelectedSubject) return "Please select a subject to start chatting...";
    if (isAITyping) return "AI is typing...";
    return "Type your message...";
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 px-4 md:px-8"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-6xl mx-auto w-full">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full px-5 py-3.5 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm ${!hasSelectedSubject ? 'cursor-not-allowed opacity-75' : ''}`}
            placeholder={getPlaceholderText()}
            aria-label="Message input"
            disabled={isAITyping || !hasSelectedSubject}
          />
          {isAITyping && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: hasSelectedSubject && input.trim() ? 1.05 : 1 }}
          whileTap={{ scale: hasSelectedSubject && input.trim() ? 0.95 : 1 }}
          className={`p-3.5 ${hasSelectedSubject && input.trim() ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400 dark:bg-gray-600'} text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md`}
          disabled={!input.trim() || isAITyping || !hasSelectedSubject}
          style={{
            boxShadow: hasSelectedSubject && input.trim() && !isAITyping
              ? '0 4px 14px rgba(59, 130, 246, 0.3)'
              : '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default MessageInput;