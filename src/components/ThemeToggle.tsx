import React, { useState, useRef, useEffect } from 'react';
import { useThemeContext } from './ThemeProvider';
import { motion } from 'framer-motion';
import useTheme from '../hooks/useTheme';

// Predefined color options for chat background
const chatBackgroundOptions = [
  { light: '#f0f5ff', dark: '#1a1d2d', name: 'Blue' },
  { light: '#f0fff5', dark: '#1a2d1d', name: 'Green' },
  { light: '#fff5f0', dark: '#2d1d1a', name: 'Orange' },
  { light: '#f5f0ff', dark: '#231a2d', name: 'Purple' },
  { light: '#f0ffff', dark: '#1a2d2d', name: 'Teal' },
  { light: '#f5f5f5', dark: '#121212', name: 'Black' },
];

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { changeChatBackgroundColor } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (colors: { light: string; dark: string }) => {
    changeChatBackgroundColor(colors);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Settings button for background */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-full focus:outline-none"
        aria-label="Chat background settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </motion.button>

      {/* Theme toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-2 rounded-full focus:outline-none"
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </motion.button>

      {/* Dropdown for background color options */}
      {showDropdown && (
        <motion.div 
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50"
        >
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Chat Background</h3>
            <div className="space-y-2">
              {chatBackgroundOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                  onClick={() => handleColorChange(option)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="w-5 h-5 rounded"
                      style={{ backgroundColor: isDarkMode ? option.dark : option.light }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeToggle;
