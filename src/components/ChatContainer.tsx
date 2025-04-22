import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ThemeToggle from './ThemeToggle';
import ApiKeyConfig from './ApiKeyConfig';
import SubjectSelectionModal from './SubjectSelectionModal';
import useChat from '../hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from './ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePersona } from '../store/slices/chatSlice';
import { AIPersona } from '../types/chat';
import { RootState } from '../store/store';

// AI Persona options with icons
const personaOptions = [
  { id: 'General Tutor' as AIPersona, name: 'General Tutor', icon: '🤖', color: 'blue' },
  { id: 'Math Expert' as AIPersona, name: 'Math Expert', icon: '📊', color: 'green' },
  { id: 'History Mentor' as AIPersona, name: 'History Mentor', icon: '📜', color: 'amber' },
  { id: 'Coding Coach' as AIPersona, name: 'Coding Coach', icon: '💻', color: 'purple' },
];

const ChatContainer: React.FC = () => {
  const { 
    clearChat, 
    activePersona, 
    useApi, 
    showApiConfig, 
    setApiKey, 
    setShowApiConfig,
    messages
  } = useChat();
  const hasSelectedSubject = useSelector((state: RootState) => state.chat.hasSelectedSubject);
  const { } = useThemeContext();
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showSwitchWarning, setShowSwitchWarning] = useState(false);
  const [pendingPersona, setPendingPersona] = useState<AIPersona | null>(null);
  const dispatch = useDispatch();

  const handlePersonaChange = (persona: AIPersona) => {
    // If we have messages and are switching to a different persona, show warning
    if (messages.length > 0 && persona !== activePersona) {
      setPendingPersona(persona);
      setShowSwitchWarning(true);
      setShowPersonaDropdown(false);
    } else {
      // Otherwise just switch directly
      dispatch(setActivePersona(persona));
      setShowPersonaDropdown(false);
    }
  };

  const confirmPersonaSwitch = () => {
    if (pendingPersona) {
      dispatch(setActivePersona(pendingPersona));
      setPendingPersona(null);
    }
    setShowSwitchWarning(false);
  };

  const cancelPersonaSwitch = () => {
    setPendingPersona(null);
    setShowSwitchWarning(false);
  };

  // Get current persona object
  const getCurrentPersona = () => {
    return personaOptions.find(p => p.id === activePersona) || personaOptions[0];
  };

  // Get color class based on current persona
  const getPersonaColorClass = () => {
    const persona = getCurrentPersona();
    switch (persona.color) {
      case 'green': return 'bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300';
      case 'amber': return 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300';
      case 'purple': return 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300';
      default: return 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-700/30 dark:hover:bg-blue-700/50 text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Subject Selection Modal (shown when no subject has been selected) */}
      <AnimatePresence>
        {!hasSelectedSubject && (
          <SubjectSelectionModal />
        )}
      </AnimatePresence>

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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${activePersona ? getPersonaColorClass() : 'bg-gray-100 dark:bg-gray-700'}`}
            >
              <span className="text-lg">{activePersona ? getCurrentPersona().icon : '📚'}</span>
              <span className="text-sm font-medium">{activePersona ? getCurrentPersona().name : 'Select Subject'}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform duration-200 ${showPersonaDropdown ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showPersonaDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Changing subjects will clear your current chat session
                  </div>
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
                        {messages.length > 0 && activePersona !== persona.id && (
                          <span className="ml-auto text-xs text-amber-600 dark:text-amber-400">Will restart chat</span>
                        )}
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

        {/* Subject Switch Warning Dialog */}
        <AnimatePresence>
          {showSwitchWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
              >
                <div className="flex items-center mb-4 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-bold">Switch Subject?</h3>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Switching to <span className="font-bold">{pendingPersona}</span> will clear your current conversation history. Are you sure you want to continue?
                </p>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelPersonaSwitch}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPersonaSwitch}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Switch & Clear Chat
                  </button>
                </div>
              </motion.div>
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