import React, { useEffect, useRef } from 'react';
import useChat from '../hooks/useChat';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import typingAnimation from '../assets/typing-animation.json';
import { useThemeContext } from './ThemeProvider';

const MessageList: React.FC = () => {
  const { messages, isAITyping, activePersona, hasSelectedSubject } = useChat();
  const { currentChatBackgroundColor, isDarkMode } = useThemeContext();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive or component loads
  useEffect(() => {
    // Add a small delay to ensure content has rendered
    const scrollTimer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 100);
    
    return () => clearTimeout(scrollTimer);
  }, [messages, isAITyping]);

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get AI icon based on active persona
  const getAIIcon = () => {
    const personaIcons: Record<string, string> = {
      'General Tutor': '🤖',
      'Math Expert': '📊',
      'History Mentor': '📜',
      'Coding Coach': '💻',
    };

    return personaIcons[activePersona || ''] || '🤖';
  };

  // Get welcome message content based on active persona
  const getWelcomeContent = () => {
    if (!activePersona || !hasSelectedSubject) {
      return {
        title: 'Welcome to AI Educational Chat',
        description: 'Please select a subject to start your educational journey.'
      };
    }

    const personaContent: Record<string, { title: string, description: string }> = {
      'General Tutor': {
        title: 'Hello! I\'m Your AI Assistant',
        description: 'Ask me any questions about various subjects to get started.'
      },
      'Math Expert': {
        title: 'Ready to Solve Math Problems!',
        description: 'Ask me about algebra, calculus, statistics, or any math concepts.'
      },
      'History Mentor': {
        title: 'Explore History Together!',
        description: 'Ask me about historical events, figures, or time periods.'
      },
      'Coding Coach': {
        title: 'Let\'s Code Something Amazing!',
        description: 'Ask me about programming concepts, languages, or debugging help.'
      }
    };

    return personaContent[activePersona] || personaContent['General Tutor'];
  };

  // Welcome message component when there are no messages
  const WelcomeMessage = () => {
    const content = getWelcomeContent();
    
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
          {hasSelectedSubject && activePersona && (
            <div className="text-4xl mb-3 text-center">{getAIIcon()}</div>
          )}
          <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white text-center">{content.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3 text-center">
            {content.description}
          </p>
          {hasSelectedSubject && activePersona && (
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
              I'll respond with informative and helpful answers to assist your learning.
            </p>
          )}
          {!hasSelectedSubject && (
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
              Click the "Select Subject" button in the top right corner to get started.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent relative"
      style={{ 
        scrollBehavior: 'smooth',
        backgroundColor: currentChatBackgroundColor 
      }}
    >
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <div className="flex flex-col space-y-5 py-6 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto w-full">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              } w-full`}
            >
              {/* Message avatar */}
              <div 
                className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full ${
                  message.sender === 'user' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200' 
                    : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                } shadow-sm border ${
                  message.sender === 'user' 
                    ? 'border-blue-200 dark:border-blue-700' 
                    : 'border-indigo-200 dark:border-indigo-700'
                }`}
              >
                {message.sender === 'user' ? (
                  <span className="text-base">👤</span>
                ) : (
                  <span className="text-base">{getAIIcon()}</span>
                )}
              </div>
              
              <div className="flex flex-col max-w-[85%]">
                <div 
                  className={`relative rounded-2xl p-4 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md ml-auto'
                      : isDarkMode 
                        ? 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-md mr-auto'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md mr-auto'
                  }`}
                  style={{ 
                    boxShadow: message.sender === 'user' 
                      ? '0 4px 6px rgba(0, 0, 0, 0.1)' 
                      : isDarkMode 
                        ? '0 4px 6px rgba(0, 0, 0, 0.2)' 
                        : '0 4px 6px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Message tail/arrow */}
                  <div 
                    className={`absolute w-3 h-3 bottom-1 ${
                      message.sender === 'user' 
                        ? '-right-1.5 bg-blue-600 transform rotate-45'
                        : '-left-1.5 ' + (isDarkMode ? 'bg-gray-800' : 'bg-white') +
                          ' transform rotate-45 border-b border-r ' + (isDarkMode ? 'border-gray-700' : 'border-gray-200')
                    }`}
                  ></div>
                  
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
                
                {/* Timestamp below message */}
                <div 
                  className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-gray-500 dark:text-gray-400 text-right mr-1' 
                      : 'text-gray-500 dark:text-gray-400 text-left ml-1'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
           
          {/* Typing indicator */}
          {isAITyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              {/* AI avatar for typing indicator */}
              <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200 shadow-sm border border-indigo-200 dark:border-indigo-700">
                <span className="text-base">{getAIIcon()}</span>
              </div>
              
              <div className="flex flex-col max-w-[85%]">
                <div 
                  className={`rounded-2xl p-3 shadow-md max-w-[200px] ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-md' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <Lottie
                    animationData={typingAnimation}
                    loop
                    style={{ width: 60, height: 30 }}
                  />
                </div>
                <div 
                  className="text-xs mt-1 text-gray-500 dark:text-gray-400 text-left ml-1"
                >
                  typing...
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageList;