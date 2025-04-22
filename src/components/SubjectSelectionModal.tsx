import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setActivePersona } from '../store/slices/chatSlice';
import { AIPersona } from '../types/chat';

// AI Persona options with icons and descriptions
const personaOptions = [
  { 
    id: 'General Tutor' as AIPersona, 
    name: 'General Tutor', 
    icon: '🤖',
    color: 'blue',
    description: 'Get help with any subject or general knowledge questions' 
  },
  { 
    id: 'Math Expert' as AIPersona, 
    name: 'Math Expert', 
    icon: '📊',
    color: 'green',
    description: 'Focus on mathematics, formulas, and problem-solving' 
  },
  { 
    id: 'History Mentor' as AIPersona, 
    name: 'History Mentor', 
    icon: '📜',
    color: 'amber',
    description: 'Explore historical events, people, and cultural contexts' 
  },
  { 
    id: 'Coding Coach' as AIPersona, 
    name: 'Coding Coach', 
    icon: '💻',
    color: 'purple',
    description: 'Learn programming concepts and get help with code' 
  },
];

const SubjectSelectionModal: React.FC = () => {
  const dispatch = useDispatch();

  const handleSelectSubject = (persona: AIPersona) => {
    dispatch(setActivePersona(persona));
  };

  // Get card background color based on subject
  const getCardBgColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'amber': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'purple': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  // Get button color based on subject
  const getButtonColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600';
      case 'amber': return 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600';
      default: return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6">
      {/* Backdrop - semi-transparent */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div 
        className="relative z-10 w-full max-w-4xl overflow-y-auto max-h-[90vh] rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6 sm:mb-8 px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            Welcome to AI Educational Chat
          </motion.h2>
          <motion.p 
            className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Select a subject to begin your learning journey. Each tutor specializes in different areas to help you learn effectively.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
          {personaOptions.map((persona, index) => (
            <motion.div
              key={persona.id}
              className={`${getCardBgColor(persona.color)} rounded-lg p-4 sm:p-5 border shadow-lg backdrop-blur-lg bg-opacity-80 dark:bg-opacity-40`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1), duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="text-4xl p-3 bg-white dark:bg-gray-800 rounded-full shadow-md self-center sm:self-start">
                  {persona.icon}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{persona.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{persona.description}</p>
                  <button
                    onClick={() => handleSelectSubject(persona.id)}
                    className={`${getButtonColor(persona.color)} text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-md w-full sm:w-auto`}
                  >
                    Start with {persona.name}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SubjectSelectionModal; 