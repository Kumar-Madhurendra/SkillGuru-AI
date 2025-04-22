import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePersona } from '../store/slices/chatSlice';
import { RootState } from '../store/store';
import { AIPersona } from '../types/chat';
import { motion } from 'framer-motion';

interface PersonaOption {
  id: AIPersona;
  name: string;
  icon: string;
  description: string;
}

const personas: PersonaOption[] = [
  { 
    id: 'General Tutor', 
    name: 'General Tutor',
    icon: '🧠',
    description: 'Versatile knowledge across multiple subjects'
  },
  { 
    id: 'Math Expert', 
    name: 'Math Expert',
    icon: '📊',
    description: 'Specialized in algebra, calculus, and statistics'
  },
  { 
    id: 'History Mentor', 
    name: 'History Mentor',
    icon: '📜',
    description: 'Expert in historical events and timelines'
  },
  { 
    id: 'Coding Coach', 
    name: 'Coding Coach',
    icon: '💻',
    description: 'Programming concepts and languages'
  }
];

const AIPersonaSelector: React.FC = () => {
  const dispatch = useDispatch();
  const activePersona = useSelector((state: RootState) => state.chat.activePersona);

  return (
    <div className="mb-6">
      <label htmlFor="ai-persona" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Choose Your AI Tutor
      </label>
      
      <div className="grid grid-cols-1 gap-2">
        {personas.map((persona) => (
          <motion.div
            key={persona.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch(setActivePersona(persona.id))}
            className={`cursor-pointer rounded-lg p-3 border transition-all ${
              activePersona === persona.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-sm'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'
            }`}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                activePersona === persona.id
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                <span className="text-xl">{persona.icon}</span>
              </div>
              
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  activePersona === persona.id
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {persona.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {persona.description}
                </p>
              </div>
              
              {activePersona === persona.id && (
                <div className="ml-auto">
                  <div className="w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIPersonaSelector;