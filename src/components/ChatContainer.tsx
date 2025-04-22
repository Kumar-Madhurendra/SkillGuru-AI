import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ThemeToggle from './ThemeToggle';
import ApiKeyConfig from './ApiKeyConfig';
import useChat from '../hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from './ThemeProvider';
import { useDispatch } from 'react-redux';
import { setActivePersona } from '../store/slices/chatSlice';
import { AIPersona } from '../types/chat';

// AI Persona options with icons
const personaOptions = [
  { id: 'General Tutor' as AIPersona, name: 'General Tutor', icon: '🤖' },
  { id: 'Math Expert' as AIPersona, name: 'Math Expert', icon: '📊' },
  { id: 'History Mentor' as AIPersona, name: 'History Mentor', icon: '📜' },
  { id: 'Coding Coach' as AIPersona, name: 'Coding Coach', icon: '💻' },
];

const ChatContainer: React.FC = () => {
  const { 
    clearChat, 
    activePersona, 
    useApi, 
    showApiConfig, 
    setApiKey, 
    setShowApiConfig 
  } = useChat();
  const { currentChatBackgroundColor } = useThemeContext();
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const dispatch = useDispatch();

  const handlePersonaChange = (persona: AIPersona) => {
    dispatch(setActivePersona(persona));
    setShowPersonaDropdown(false);
  };

  // Get current persona object
  const getCurrentPersona = () => {
    return personaOptions.find(p => p.id === activePersona) || personaOptions[0];
  };

  return (
    <div className="flex flex-col h-screen w-full max-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-gray-800 shadow-lg p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-blue-600 dark:text-blue-400 text-2xl mr-2">🧠</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Educational Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              className="text-sm px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Chat
            </button>
            <div 
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                useApi 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border border-green-300 dark:border-green-700'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${useApi ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{useApi ? 'API Active' : 'API Inactive'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Persona Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
              className="flex items-center gap-2 bg-blue-50 dark:bg-gray-700 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-lg">{getCurrentPersona().icon}</span>
              <span className="text-sm text-blue-700 dark:text-blue-300">{getCurrentPersona().name}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 text-blue-500 dark:text-blue-300 transition-transform duration-200 ${showPersonaDropdown ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showPersonaDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {personaOptions.map((persona) => (
                    <button
                      key={persona.id}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        activePersona === persona.id 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handlePersonaChange(persona.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{persona.icon}</span>
                        <span>{persona.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <ThemeToggle />
        </div>
      </motion.div>

      {/* Main Container with chat only */}
      <div className="flex flex-1 w-full overflow-hidden relative">
        {/* API Config Dialog */}
        <AnimatePresence>
          {showApiConfig && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
              <ApiKeyConfig 
                onSave={setApiKey}
                onCancel={() => setShowApiConfig(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Chat Area - full width */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col overflow-hidden w-full h-full"
        >
          <div className="flex-1 overflow-hidden w-full h-full relative">
            <MessageList />
          </div>
        </motion.div>
      </div>
      <div className="w-full">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;